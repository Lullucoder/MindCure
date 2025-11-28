import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import { getAllAppointments } from '../controllers/appointmentController.js';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  getResources,
  createResource,
  updateResource,
  deleteResource,
  updateCategory,
  deleteCategory
} from '../controllers/adminController.js';
import {
  getCategories,
  getPosts,
  getPost,
  createPost,
  addComment,
  togglePostLike,
  deletePost
} from '../controllers/studentController.js';
import {
  getPostsForModeration,
  moderatePost,
  createCategory
} from '../controllers/counselorController.js';

const adminRouter = Router();

// All routes require authentication and admin role
adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);

// Dashboard
adminRouter.get('/stats', getDashboardStats);

// User management
adminRouter.get('/users', getUsers);
adminRouter.patch('/users/:id/role', updateUserRole);

// Appointment management
adminRouter.get('/appointments', getAllAppointments);

// Resource management
adminRouter.get('/resources', getResources);
adminRouter.post('/resources', createResource);
adminRouter.patch('/resources/:id', updateResource);
adminRouter.delete('/resources/:id', deleteResource);

// Category management
adminRouter.patch('/categories/:id', updateCategory);
adminRouter.delete('/categories/:id', deleteCategory);

// Forum Access (admin can view, post, comment, like)
adminRouter.get('/forum/categories', getCategories);
adminRouter.get('/forum/posts', getPosts);
adminRouter.get('/forum/posts/:id', getPost);
adminRouter.post('/forum/posts', createPost);
adminRouter.post('/forum/posts/:id/comments', addComment);
adminRouter.post('/forum/posts/:id/like', togglePostLike);
adminRouter.delete('/forum/posts/:id', deletePost);

// Forum Moderation
adminRouter.get('/forum/moderation', getPostsForModeration);
adminRouter.patch('/forum/moderation/:id', moderatePost);
adminRouter.post('/forum/categories', createCategory);

export default adminRouter;
