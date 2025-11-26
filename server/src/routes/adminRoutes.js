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

export default adminRouter;
