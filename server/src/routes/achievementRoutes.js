import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getAchievements,
  getAchievementDefinitions,
  getStatsSummary,
  getUserPublicAchievements
} from '../controllers/achievementController.js';

const achievementRouter = Router();

// All routes require authentication
achievementRouter.use(requireAuth);

// Get achievement definitions
achievementRouter.get('/definitions', getAchievementDefinitions);

// Get current user's achievements
achievementRouter.get('/', getAchievements);

// Get current user's stats summary
achievementRouter.get('/stats', getStatsSummary);

// Get another user's public achievements
achievementRouter.get('/user/:userId', getUserPublicAchievements);

export default achievementRouter;
