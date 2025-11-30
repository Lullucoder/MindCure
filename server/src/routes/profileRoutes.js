import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getUserStats,
  updateStats,
  deleteAccount,
  uploadAvatar
} from '../controllers/profileController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/', updateProfile);

// Update password
router.put('/password', updatePassword);

// Get user stats
router.get('/stats', getUserStats);

// Update user stats
router.post('/stats', updateStats);

// Upload avatar
router.post('/avatar', uploadAvatar);

// Delete account
router.delete('/', deleteAccount);

export default router;
