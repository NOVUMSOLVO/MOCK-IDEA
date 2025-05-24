import express from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { ApiError } from '../utils/errors';

const router = express.Router();

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().default(false)
});

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
});

const addMockupSchema = z.object({
  mockupId: z.string()
});

// Create a new project
router.post('/', authenticateToken, validateRequest(createProjectSchema), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, description, isPublic } = req.body;

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description,
        isPublic,
        mockupIds: []
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
});

// Get user's projects
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({
        where: { userId }
      })
    ]);

    // Get mockup details for each project
    const projectsWithMockups = await Promise.all(
      projects.map(async (project) => {
        const mockups = await prisma.mockup.findMany({
          where: {
            id: { in: project.mockupIds }
          },
          include: {
            logo: true,
            template: true
          }
        });

        return {
          ...project,
          mockups
        };
      })
    );

    res.json({
      success: true,
      data: {
        projects: projectsWithMockups,
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

// Get specific project
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Get mockup details
    const mockups = await prisma.mockup.findMany({
      where: {
        id: { in: project.mockupIds }
      },
      include: {
        logo: true,
        template: true
      }
    });

    res.json({
      success: true,
      data: {
        ...project,
        mockups
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update project
router.patch('/:id', authenticateToken, validateRequest(updateProjectSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const project = await prisma.project.findFirst({
      where: { id, userId }
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
});

// Add mockup to project
router.post('/:id/mockups', authenticateToken, validateRequest(addMockupSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mockupId } = req.body;
    const userId = req.user!.id;

    const [project, mockup] = await Promise.all([
      prisma.project.findFirst({
        where: { id, userId }
      }),
      prisma.mockup.findFirst({
        where: { id: mockupId, userId }
      })
    ]);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (!mockup) {
      throw new ApiError(404, 'Mockup not found');
    }

    if (project.mockupIds.includes(mockupId)) {
      throw new ApiError(400, 'Mockup already in project');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        mockupIds: [...project.mockupIds, mockupId]
      }
    });

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
});

// Remove mockup from project
router.delete('/:id/mockups/:mockupId', authenticateToken, async (req, res, next) => {
  try {
    const { id, mockupId } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: { id, userId }
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        mockupIds: project.mockupIds.filter(mid => mid !== mockupId)
      }
    });

    res.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: { id, userId }
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as projectRouter };
