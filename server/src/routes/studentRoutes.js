import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getStudentDashboard,
  getResources,
  getResource,
  toggleResourceLike,
  getCounselors,
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getCategories,
  getPosts,
  getPost,
  createPost,
  addComment,
  togglePostLike,
  deletePost
} from '../controllers/studentController.js';

const studentRouter = Router();

// All routes require authentication
studentRouter.use(requireAuth);

// Dashboard
studentRouter.get('/dashboard', getStudentDashboard);

// Resources (read-only)
studentRouter.get('/resources', getResources);
studentRouter.get('/resources/:id', getResource);
studentRouter.post('/resources/:id/like', toggleResourceLike);

// Counselors
studentRouter.get('/counselors', getCounselors);
studentRouter.get('/counselors/slots', getAvailableSlots);

// Appointments
studentRouter.get('/appointments', getMyAppointments);
studentRouter.post('/appointments', bookAppointment);
studentRouter.patch('/appointments/:id/cancel', cancelAppointment);

// Forum
studentRouter.get('/forum/categories', getCategories);
studentRouter.get('/forum/posts', getPosts);
studentRouter.get('/forum/posts/:id', getPost);
studentRouter.post('/forum/posts', createPost);
studentRouter.post('/forum/posts/:id/comments', addComment);
studentRouter.post('/forum/posts/:id/like', togglePostLike);
studentRouter.delete('/forum/posts/:id', deletePost);

export default studentRouter;
