import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { logoRouter } from './routes/logos';
import { mockupRouter } from './routes/mockups';
import { templateRouter } from './routes/templates';
import { userRouter } from './routes/users';
import { projectRouter } from './routes/projects';
import { webhookRouter } from './routes/webhooks';
import { errorHandler } from './utils/errors';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import { initializeQueues } from './services/queueService';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Make io globally available
declare global {
  var io: Server;
}
global.io = io;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3333',
    'http://localhost:8080',
    'null' // Allow file:// origins
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(rateLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.io setup
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-user-room', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/logos', logoRouter);
app.use('/api/mockups', mockupRouter);
app.use('/api/templates', templateRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/webhooks', webhookRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Error handling
app.use(errorHandler);

// Function to find an available port
async function findAvailablePort(startPort: number): Promise<number> {
  const net = await import('net');

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => {
        resolve(port);
      });
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');

    // await initializeQueues();
    // logger.info('Queue service initialized');

    // Find an available port starting from the preferred port
    const preferredPort = parseInt(process.env.PORT || '3001');
    const PORT = await findAvailablePort(preferredPort);

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);

      // Update environment variable for other services
      process.env.BACKEND_URL = `http://localhost:${PORT}`;

      if (PORT !== preferredPort) {
        logger.warn(`⚠️  Preferred port ${preferredPort} was in use, using port ${PORT} instead`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});