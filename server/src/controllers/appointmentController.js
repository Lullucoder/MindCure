import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';

// Get all counselors
export const getCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ 
      role: 'counselor',
      isAvailable: true 
    }).select('firstName lastName email bio specializations');
    
    res.json({ counselors });
  } catch (error) {
    console.error('Get counselors error:', error);
    res.status(500).json({ message: 'Failed to fetch counselors' });
  }
};

// Get available time slots for a counselor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { counselorId, date } = req.query;
    
    if (!counselorId || !date) {
      return res.status(400).json({ message: 'Counselor ID and date are required' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get existing appointments for that counselor on that date
    const existingAppointments = await Appointment.find({
      counselor: counselorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);

    // Define available time slots (9 AM to 5 PM)
    const allSlots = [
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '13:00-14:00', // After lunch
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00'
    ];

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots, bookedSlots });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Failed to fetch available slots' });
  }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { counselorId, date, timeSlot, type, reason } = req.body;
    const studentId = req.user.id;

    // Validate counselor exists
    const counselor = await User.findOne({ _id: counselorId, role: 'counselor' });
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    // Check if slot is still available
    const existingAppointment = await Appointment.findOne({
      counselor: counselorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is no longer available' });
    }

    // Create appointment
    const appointment = new Appointment({
      student: studentId,
      counselor: counselorId,
      date: new Date(date),
      timeSlot,
      type: type || 'video',
      reason: reason || '',
      status: 'pending'
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('counselor', 'firstName lastName email')
      .populate('student', 'firstName lastName email');

    res.status(201).json({ 
      message: 'Appointment booked successfully',
      appointment: populatedAppointment 
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
};

// Get user's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, upcoming } = req.query;

    let query = {};
    
    // Filter by role
    if (userRole === 'counselor') {
      query.counselor = userId;
    } else {
      query.student = userId;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter upcoming only
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['pending', 'confirmed'] };
    }

    const appointments = await Appointment.find(query)
      .populate('counselor', 'firstName lastName email specializations')
      .populate('student', 'firstName lastName email')
      .sort({ date: 1, timeSlot: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Update appointment status (for counselors)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, meetingLink } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only counselor or the student can update
    if (appointment.counselor.toString() !== userId && appointment.student.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (meetingLink) appointment.meetingLink = meetingLink;

    await appointment.save();

    const updated = await Appointment.findById(id)
      .populate('counselor', 'firstName lastName email')
      .populate('student', 'firstName lastName email');

    res.json({ message: 'Appointment updated', appointment: updated });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only counselor or the student can cancel
    if (appointment.counselor.toString() !== userId && appointment.student.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = reason || '';
    appointment.cancelledBy = userId;

    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};

// Get all appointments (admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const total = await Appointment.countDocuments(query);
    
    const appointments = await Appointment.find(query)
      .populate('counselor', 'firstName lastName email')
      .populate('student', 'firstName lastName email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ 
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};
