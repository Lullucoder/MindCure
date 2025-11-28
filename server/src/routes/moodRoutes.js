import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  checkInMood,
  updateTodaysMood,
  hasCheckedInToday,
  getMoodHistory,
  recordMoodImprovement,
  getMoodOptions
} from '../controllers/moodController.js';

const moodRouter = Router();

// All routes require authentication
moodRouter.use(requireAuth);

// Get mood options (no auth needed but keeping it consistent)
moodRouter.get('/options', getMoodOptions);

// Check if user has checked in today
moodRouter.get('/today', hasCheckedInToday);

// Get mood history
moodRouter.get('/history', getMoodHistory);

// Check in mood for today
moodRouter.post('/checkin', checkInMood);

// Update today's mood
moodRouter.patch('/today', updateTodaysMood);

// Record mood improvement after chat
moodRouter.post('/improvement', recordMoodImprovement);

export default moodRouter;
