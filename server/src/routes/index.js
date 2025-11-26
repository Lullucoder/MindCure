import { Router } from 'express';
import authRouter from './authRoutes.js';
import activityRouter from './activityRoutes.js';
import preferencesRouter from './preferencesRoutes.js';
import appointmentRouter from './appointmentRoutes.js';
import forumRouter from './forumRoutes.js';
import adminRouter from './adminRoutes.js';
import resourceRouter from './resourceRoutes.js';
import counselorRouter from './counselorRoutes.js';
import studentRouter from './studentRoutes.js';
import chatRouter from './chatRoutes.js';
import profileRouter from './profileRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/activities', activityRouter);
router.use('/preferences', preferencesRouter);
router.use('/appointments', appointmentRouter);
router.use('/forum', forumRouter);
router.use('/admin', adminRouter);
router.use('/resources', resourceRouter);
router.use('/counselor', counselorRouter);
router.use('/student', studentRouter);
router.use('/chat', chatRouter);
router.use('/profile', profileRouter);

export default router;
