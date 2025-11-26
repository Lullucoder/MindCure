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

// Forum Moderation
counselorRouter.get('/forum/posts', getPostsForModeration);
counselorRouter.patch('/forum/posts/:id', moderatePost);
counselorRouter.post('/forum/categories', createCategory);

// Profile
counselorRouter.patch('/availability', updateAvailability);

// Students
counselorRouter.get('/students', getStudents);

export default counselorRouter;
