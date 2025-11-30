import { Router } from 'express';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';
import {
  getUserPublicProfile,
  getUserMoodHistory,
  searchUsers,
  getAllStudents
} from '../controllers/userProfileController.js';

const userRouter = Router();

// Search users (requires auth)
userRouter.get('/search', requireAuth, searchUsers);

// Get all students (for counselors)
userRouter.get('/students', requireAuth, getAllStudents);

// Get user's public profile (optional auth - shows more info if logged in)
userRouter.get('/:userId', optionalAuth, getUserPublicProfile);

// Get user's mood history (requires auth + friendship)
userRouter.get('/:userId/mood-history', requireAuth, getUserMoodHistory);

export default userRouter;
