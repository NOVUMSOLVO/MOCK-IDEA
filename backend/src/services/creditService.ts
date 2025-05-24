import { prisma } from '../server';
import { ApiError } from '../utils/errors';

export async function checkCredits(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true, subscriptionTier: true }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Unlimited tier has unlimited credits
  if (user.subscriptionTier === 'UNLIMITED') {
    return true;
  }

  return user.creditsRemaining > 0;
}

export async function deductCredits(userId: string, amount: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Don't deduct for unlimited tier
  if (user.subscriptionTier === 'UNLIMITED') {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsRemaining: {
        decrement: amount
      }
    }
  });
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      creditsRemaining: {
        increment: amount
      }
    }
  });
}

// Monthly credit reset for subscribers
export async function resetMonthlyCredits(): Promise<void> {
  const creditsByTier = {
    FREE: 3,
    BASIC: 15,
    PRO: 50,
    UNLIMITED: 999999
  };

  for (const [tier, credits] of Object.entries(creditsByTier)) {
    await prisma.user.updateMany({
      where: {
        subscriptionTier: tier as any,
        isActive: true
      },
      data: {
        creditsRemaining: credits
      }
    });
  }
}