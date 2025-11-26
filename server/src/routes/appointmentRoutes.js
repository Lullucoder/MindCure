import { Router } from 'express';
import { requireAuth, requireCounselor } from '../middleware/authMiddleware.js';
import {
  getCounselors,
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';

const appointmentRouter = Router();

// All routes require authentication
appointmentRouter.use(requireAuth);

// Get list of available counselors
appointmentRouter.get('/counselors', getCounselors);

// Get available time slots for a counselor
appointmentRouter.get('/slots', getAvailableSlots);

// Book an appointment (students)
appointmentRouter.post('/book', bookAppointment);

// Get my appointments (works for both students and counselors)
appointmentRouter.get('/my', getMyAppointments);

// Update appointment status (counselors)
appointmentRouter.patch('/:id/status', updateAppointmentStatus);

// Cancel appointment
appointmentRouter.patch('/:id/cancel', cancelAppointment);

export default appointmentRouter;
