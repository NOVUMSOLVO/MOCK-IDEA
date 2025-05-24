import express from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { ApiError } from '../utils/errors';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Middleware to check for admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user!.subscriptionTier !== 'ADMIN') { // Assuming 'ADMIN' is the role identifier
    throw new ApiError(403, 'Admin access required');
  }
  next();
};

const templateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  aiAnalysis: z.object({
    placement: z.object({
      preferredPosition: z.string(),
      scaleRange: z.array(z.number()).length(2),
      rotationTolerance: z.number()
    }).optional()
  }).optional()
});

// Admin route to create a new template (requires admin role)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const templateData = templateSchema.parse(req.body);

    const template = await prisma.template.create({
      data: templateData
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      tags,
      isPremium,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (isPremium !== undefined) {
      where.isPremium = isPremium === 'true';
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = {
        hasSome: tagArray
      };
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'popularity') {
      orderBy.popularity = sortOrder;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.template.count({ where })
    ]);

    // Update popularity for viewed templates
    if (templates.length > 0) {
      await prisma.template.updateMany({
        where: {
          id: { in: templates.map(t => t.id) }
        },
        data: {
          popularity: { increment: 1 }
        }
      });
    }

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        filters: {
          categories: await prisma.template.groupBy({
            by: ['category'],
            where: { isActive: true }
          }),
          tags: await prisma.template.findMany({
            select: { tags: true },
            where: { isActive: true }
          }).then(results =>
            [...new Set(results.flatMap(r => r.tags))]
          )
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
});

const updateTemplateSchema = z.object({
  name: z.string().optional(),
  imageUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().optional(),
  isPremium: z.boolean().optional(),
  aiAnalysis: z.object({
    placement: z.object({
      preferredPosition: z.string().optional(),
      scaleRange: z.array(z.number()).length(2).optional(),
      rotationTolerance: z.number().optional()
    }).optional()
  }).optional()
});

// Admin route to update a template by ID
router.patch('/:id', authenticateToken, requireAdmin, validateRequest(updateTemplateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: updatedTemplate
    });
  } catch (error) {
    next(error);
  }
});

// Admin route to delete a template by ID
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    await prisma.template.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as templateRouter };