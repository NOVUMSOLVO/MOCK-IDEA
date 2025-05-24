import Bull from 'bull';
import { createClient } from 'redis';
import { prisma } from '../server';
import generateMockup from './mockupGenerator';
import { logger } from '../utils/logger';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const generateMockupQueue = new Bull('mockup generation', {
  redis: {
    port: 6379,
    host: process.env.REDIS_HOST || 'localhost',
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
});

// Queue handler temporarily disabled to avoid conflicts
// generateMockupQueue.process('generate-mockup', 5, async (job) => {
//   // Handler implementation moved to avoid duplicate registration
// });

export async function initializeQueues() {
  await redis.connect();
  logger.info('Queue service initialized');
}