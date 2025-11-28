import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  clearAll
} from '../controllers/notificationController.js';

const notificationRouter = Router();

// All routes require authentication
notificationRouter.use(requireAuth);

// Get notifications
notificationRouter.get('/', getNotifications);

// Get unread count
notificationRouter.get('/unread-count', getUnreadCount);

// Mark one notification as read
notificationRouter.patch('/:notificationId/read', markAsRead);

// Mark all as read
notificationRouter.patch('/read-all', markAllAsRead);

// Delete a notification
notificationRouter.delete('/:notificationId', deleteNotification);

// Clear all notifications
notificationRouter.delete('/', clearAll);

export default notificationRouter;
