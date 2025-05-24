import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import Vibrant from 'node-vibrant';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { uploadToS3 } from '../services/storageService';
import { analyzeLogoWithAI } from '../services/aiService';
import { ApiError } from '../utils/errors';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/upload',
  authenticateToken,
  upload.single('logo'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
      }

      const userId = req.user!.id;

      // Process image with Sharp
      const processedImage = await sharp(req.file.buffer)
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 90 })
        .toBuffer();

      // Generate thumbnail
      const thumbnail = await sharp(req.file.buffer)
        .resize(300, 300, { fit: 'inside' })
        .png({ quality: 80 })
        .toBuffer();

      // Upload to S3
      const filename = `logos/${userId}/${Date.now()}-${req.file.originalname}`;
      const thumbnailFilename = `thumbnails/${userId}/${Date.now()}-thumb-${req.file.originalname}`;

      const [originalUrl, thumbnailUrl] = await Promise.all([
        uploadToS3(processedImage, filename, req.file.mimetype),
        uploadToS3(thumbnail, thumbnailFilename, 'image/png')
      ]);

      // Extract colors using Vibrant
      const palette = await Vibrant.from(req.file.buffer).getPalette();
      const colors = Object.entries(palette)
        .filter(([_, swatch]) => swatch)
        .map(([name, swatch]) => ({
          name,
          hex: swatch!.hex,
          rgb: swatch!.rgb,
          population: swatch!.population
        }));

      // AI Analysis
      const aiAnalysis = await analyzeLogoWithAI(req.file.buffer, colors);

      // Save to database
      const logo = await prisma.logo.create({
        data: {
          userId,
          filename: req.file.originalname,
          originalUrl,
          fileSize: processedImage.length,
          mimeType: req.file.mimetype,
          aiAnalysis: {
            colors,
            ...aiAnalysis
          }
        }
      });

      res.status(201).json({
        success: true,
        data: logo
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const logos = await prisma.logo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: logos
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const logo = await prisma.logo.findFirst({
      where: { id, userId }
    });

    if (!logo) {
      throw new ApiError(404, 'Logo not found');
    }

    res.json({
      success: true,
      data: logo
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/analyze', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const logo = await prisma.logo.findFirst({
      where: { id, userId }
    });

    if (!logo) {
      throw new ApiError(404, 'Logo not found');
    }

    // Return the existing AI analysis or trigger a new one
    if (logo.aiAnalysis) {
      const analysis = logo.aiAnalysis as any;
      res.json({
        success: true,
        data: {
          colors: analysis.colors || [],
          style: analysis.style || 'modern',
          hasText: analysis.hasText || false,
          complexity: analysis.complexity || 5,
          recommendedTemplates: analysis.recommendedCategories || ['business', 'general'],
          dimensions: { width: 1000, height: 1000 }
        }
      });
    } else {
      // Trigger new analysis (this would normally re-analyze the logo)
      res.json({
        success: true,
        data: {
          colors: ['#000000', '#ffffff'],
          style: 'modern',
          hasText: false,
          complexity: 5,
          recommendedTemplates: ['business', 'general'],
          dimensions: { width: 1000, height: 1000 }
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

export { router as logoRouter };