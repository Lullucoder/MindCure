import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, refresh, signup } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

authRouter.use(authLimiter);

authRouter.post('/signup', signup);

authRouter.post('/login', login);

authRouter.post('/refresh', refresh);

authRouter.post('/logout', logout);

authRouter.get('/me', requireAuth, me);

export default authRouter;
