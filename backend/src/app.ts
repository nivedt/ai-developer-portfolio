import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import projectRoutes from './routes/projects';
import skillRoutes from './routes/skills';
import contactRoutes from './routes/contact';
import aiRoutes from './routes/ai';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Initialize Express app
const app = express();

// Initialize Prisma
export const prisma = new PrismaClient();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/ai', aiRoutes);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'AI Developer Portfolio API',
    version: '1.0.0',
    description: 'RESTful API for the AI Developer Portfolio application',
    status: 'Development - Basic setup complete',
    endpoints: {
      health: 'GET /health - Health check',
      docs: 'GET /api/docs - API documentation',
      testDb: 'GET /api/test-db - Database connection test',
      register: 'POST /api/auth/register - User registration',
      login: 'POST /api/auth/login - User login',
      me: 'GET /api/auth/me - Get current user (requires auth)',
    },
  });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;