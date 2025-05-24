import express from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { generateMockupQueue } from '../services/queueService';
import { validateRequest } from '../middleware/validation';
import { ApiError } from '../utils/errors';
import { checkCredits, deductCredits } from '../services/creditService';
import { TextClipping } from '../services/mockupWorker'; // Added import for TextClipping

const router = express.Router();

const createMockupSchema = z.object({
  logoId: z.string(),
  templateId: z.string(),
  customizations: z.object({
    position: z.object({
      x: z.number(),
      y: z.number()
    }).optional(),
    scale: z.number().min(0.1).max(3).optional(),    rotation: z.number().min(-180).max(180).optional(),
    opacity: z.number().min(0).max(1).optional(),
    blendMode: z.enum(["clear", "source", "over", "in", "out", "atop", "dest", "dest-over", "dest-in", "dest-out", "dest-atop", "xor", "add", "saturate", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]).optional(), // Added blendMode
    tint: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), // Added tint (hex color)
    grayscale: z.boolean().optional(), // Added grayscale
    // Text clipping and customization options
    text: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().min(1).optional(),
    textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    textClipping: z.nativeEnum(TextClipping).optional(), // Added textClipping validation
    textPath: z.string().optional(), // SVG path for clipping
    textAlign: z.enum(["left", "center", "right"]).optional(),
    textStrokeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    textStrokeWidth: z.number().min(0).optional()
  }).optional()
});

router.post('/',
  authenticateToken,
  validateRequest(createMockupSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const { logoId, templateId, customizations } = req.body;

      // Check if user has credits
      const hasCredits = await checkCredits(userId);
      if (!hasCredits) {
        throw new ApiError(403, 'Insufficient credits');
      }

      // Verify logo ownership
      const logo = await prisma.logo.findFirst({
        where: { id: logoId, userId }
      });

      if (!logo) {
        throw new ApiError(404, 'Logo not found');
      }

      // Verify template exists
      const template = await prisma.template.findUnique({
        where: { id: templateId }
      });

      if (!template) {
        throw new ApiError(404, 'Template not found');
      }

      // Check if premium template requires subscription
      if (template.isPremium && req.user!.subscriptionTier === 'FREE') {
        throw new ApiError(403, 'Premium template requires subscription');
      }

      // Create mockup record
      const mockup = await prisma.mockup.create({
        data: {
          userId,
          logoId,
          templateId,
          customizations,
          status: 'PENDING'
        },
        include: {
          logo: true,
          template: true
        }
      });

      // Add to processing queue
      await generateMockupQueue.add('generate-mockup', {
        mockupId: mockup.id,
        logoUrl: logo.originalUrl,
        templateUrl: template.imageUrl,
        customizations,
        userId
      });

      // Deduct credits (don't wait for processing to complete)
      // Deduct credits after successfully adding to queue
      await deductCredits(userId, 1);

      // Emit socket event for real-time updates
      const io = req.app.get('io');
      io.to(`user-${userId}`).emit('mockup-queued', { mockupId: mockup.id });

      res.status(201).json({
        success: true,
        data: mockup
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [mockups, total] = await Promise.all([
      prisma.mockup.findMany({
        where: { userId },
        include: {
          logo: true,
          template: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.mockup.count({
        where: { userId }
      })
    ]);

    res.json({
      success: true,
      data: {
        mockups,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const mockup = await prisma.mockup.findFirst({
      where: { id, userId },
      include: {
        logo: true,
        template: true
      }
    });

    if (!mockup) {
      throw new ApiError(404, 'Mockup not found');
    }

    res.json({
      success: true,
      data: mockup
    });
  } catch (error) {
    next(error);
  }
});

const updateMockupSchema = z.object({
  customizations: z.object({
    position: z.object({
      x: z.number(),
      y: z.number()
    }).optional(),
    scale: z.number().min(0.1).max(3).optional(),
    rotation: z.number().min(-180).max(180).optional(),
    opacity: z.number().min(0).max(1).optional(),
    blendMode: z.enum(["clear", "source", "over", "in", "out", "atop", "dest", "dest-over", "dest-in", "dest-out", "dest-atop", "xor", "add", "saturate", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"]).optional(), // Added blendMode
    tint: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), // Added tint (hex color)
    grayscale: z.boolean().optional(), // Added grayscale
    // Text clipping and customization options
    text: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().min(1).optional(),
    textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    textClipping: z.nativeEnum(TextClipping).optional(), // Added textClipping validation
    textPath: z.string().optional(), // SVG path for clipping
    textAlign: z.enum(["left", "center", "right"]).optional(),
    textStrokeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    textStrokeWidth: z.number().min(0).optional()
  }).optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional()
});

router.patch('/:id',
  authenticateToken,
  validateRequest(updateMockupSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const updateData = req.body;

      const mockup = await prisma.mockup.findFirst({
        where: { id, userId }
      });

      if (!mockup) {
        throw new ApiError(404, 'Mockup not found');
      }

      const updatedMockup = await prisma.mockup.update({
        where: { id },
        data: updateData,
        include: {
          logo: true,
          template: true
        }
      });

      res.json({
        success: true,
        data: updatedMockup
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const mockup = await prisma.mockup.findFirst({
      where: { id, userId }
    });

    if (!mockup) {
      throw new ApiError(404, 'Mockup not found');
    }

    // In a real app, you might also delete associated files from S3 here
    // await deleteFromS3(mockup.renderUrl);
    // await deleteFromS3(mockup.thumbnailUrl);

    await prisma.mockup.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Mockup deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as mockupRouter };