import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../server';
import { authenticateToken } from '../middleware/auth';
import { ApiError } from '../utils/errors';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        creditsRemaining: true,
        brandKit: true,
        role: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional()
});

const brandKitSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  logoStyle: z.string().optional(),
  brandPersonality: z.array(z.string()).optional(),
  preferredCategories: z.array(z.string()).optional()
});

router.patch('/me', authenticateToken, validateRequest(updateUserSchema), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        creditsRemaining: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8)
});

router.patch('/me/password', authenticateToken, validateRequest(changePasswordSchema), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword
      }
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const [totalLogos, totalMockups, recentActivity] = await Promise.all([
      prisma.logo.count({
        where: { userId }
      }),
      prisma.mockup.count({
        where: { userId }
      }),
      prisma.mockup.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsRemaining: true }
    });

    res.json({
      success: true,
      data: {
        totalLogos,
        totalMockups,
        creditsRemaining: user?.creditsRemaining || 0,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update brand kit
router.patch('/me/brand-kit', authenticateToken, validateRequest(brandKitSchema), async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const brandKitData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        brandKit: brandKitData
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        subscriptionTier: true,
        creditsRemaining: true,
        brandKit: true,
        role: true
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Get brand kit
router.get('/me/brand-kit', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        brandKit: true
      }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user.brandKit || {}
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRouter };