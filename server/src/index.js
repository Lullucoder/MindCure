import './config/loadEnv.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import router from './routes/index.js';
import { ForumCategory } from './models/ForumCategory.js';

const app = express();

// Core security & parsing middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = new Set(env.clientOrigins);
console.log('🌐 Allowed CORS origins:', [...allowedOrigins]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    console.log(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Logging
if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

// Auto-seed forum categories if none exist
const seedForumCategories = async () => {
  try {
    const count = await ForumCategory.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: 'Anxiety', description: 'Discuss anxiety-related experiences and coping strategies', icon: '😰', color: '#f59e0b', order: 1 },
        { name: 'Depression', description: 'Support for those dealing with depression', icon: '🌧️', color: '#6366f1', order: 2 },
        { name: 'Stress Management', description: 'Tips and discussions about managing stress', icon: '💆', color: '#10b981', order: 3 },
        { name: 'Relationships', description: 'Talk about relationship challenges and advice', icon: '💕', color: '#ec4899', order: 4 },
        { name: 'Academic Pressure', description: 'Support for academic stress and burnout', icon: '📚', color: '#8b5cf6', order: 5 },
        { name: 'Self-Care', description: 'Share self-care routines and wellness tips', icon: '🧘', color: '#14b8a6', order: 6 },
        { name: 'General Support', description: 'General mental health discussions', icon: '🤗', color: '#06b6d4', order: 7 }
      ];
      await ForumCategory.insertMany(defaultCategories);
      console.log('✅ Seeded default forum categories');
    }
  } catch (error) {
    console.error('⚠️ Failed to seed forum categories:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDatabase();
    
    // Seed forum categories after DB connection
    await seedForumCategories();

    app.listen(env.port, () => {
      console.log(`\u2705 MindCure API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('\u274c Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
