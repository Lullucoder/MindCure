import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getCounselorDashboard,
  getMyResources,
  createResource,
  updateResource,
  deleteResource,
  getMyAppointments,
  confirmAppointment,
  completeAppointment,
  cancelAppointment,
  getPostsForModeration,
  moderatePost,
  createCategory,
  updateAvailability,
  getStudents
} from '../controllers/counselorController.js';
import {
  getCategories,
  getPosts,
  getPost,
  createPost,
  addComment,
  togglePostLike,
  deletePost
} from '../controllers/studentController.js';

const counselorRouter = Router();

// All routes require authentication and counselor/admin role
counselorRouter.use(requireAuth);
counselorRouter.use(requireRole('counselor', 'admin'));

// Dashboard
counselorRouter.get('/dashboard', getCounselorDashboard);

// Resources Management
counselorRouter.get('/resources', getMyResources);
counselorRouter.post('/resources', createResource);
counselorRouter.patch('/resources/:id', updateResource);
counselorRouter.delete('/resources/:id', deleteResource);

// Appointments Management
counselorRouter.get('/appointments', getMyAppointments);
counselorRouter.patch('/appointments/:id/confirm', confirmAppointment);
counselorRouter.patch('/appointments/:id/complete', completeAppointment);
counselorRouter.patch('/appointments/:id/cancel', cancelAppointment);

// Forum Access (same as students - can view, post, comment, like)
counselorRouter.get('/forum/categories', getCategories);
counselorRouter.get('/forum/posts', getPosts);
counselorRouter.get('/forum/posts/:id', getPost);
counselorRouter.post('/forum/posts', createPost);
counselorRouter.post('/forum/posts/:id/comments', addComment);
counselorRouter.post('/forum/posts/:id/like', togglePostLike);
counselorRouter.delete('/forum/posts/:id', deletePost);

// Forum Moderation (counselor/admin only)
counselorRouter.get('/forum/moderation', getPostsForModeration);
counselorRouter.patch('/forum/moderation/:id', moderatePost);
counselorRouter.post('/forum/categories', createCategory);

// Profile
counselorRouter.patch('/availability', updateAvailability);

// Students
counselorRouter.get('/students', getStudents);

export default counselorRouter;
