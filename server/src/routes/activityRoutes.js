import { Router } from 'express';
import { getRecentActivities, getSummary, logActivity } from '../controllers/activityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const activityRouter = Router();

activityRouter.use(requireAuth);

activityRouter.post('/', logActivity);
activityRouter.get('/summary', getSummary);
activityRouter.get('/recent', getRecentActivities);

export default activityRouter;
