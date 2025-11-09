import { Router } from 'express';
import { getPreferences, updatePreferences } from '../controllers/preferencesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const preferencesRouter = Router();

preferencesRouter.use(requireAuth);

preferencesRouter.get('/', getPreferences);
preferencesRouter.put('/', updatePreferences);

export default preferencesRouter;
