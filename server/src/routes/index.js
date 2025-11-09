import { Router } from 'express';
import authRouter from './authRoutes.js';
import activityRouter from './activityRoutes.js';
import preferencesRouter from './preferencesRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/activities', activityRouter);
router.use('/preferences', preferencesRouter);

export default router;
