import { Resource } from '../models/Resource.js';
import { Appointment } from '../models/Appointment.js';
import { ForumPost } from '../models/ForumPost.js';
import { ForumCategory } from '../models/ForumCategory.js';
import { User } from '../models/User.js';

// ==================== DASHBOARD STATS ====================

export const getCounselorDashboard = async (req, res) => {
  try {
    const counselorId = req.user.id;

    // Get counselor's stats
    const [
      totalResources,
      publishedResources,
      totalAppointments,
      pendingAppointments,
      upcomingAppointments,
      completedAppointments
    ] = await Promise.all([
      Resource.countDocuments({ createdBy: counselorId }),
      Resource.countDocuments({ createdBy: counselorId, isPublished: true }),
      Appointment.countDocuments({ counselor: counselorId }),
      Appointment.countDocuments({ counselor: counselorId, status: 'pending' }),
      Appointment.countDocuments({ 
        counselor: counselorId, 
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: new Date() }
      }),
      Appointment.countDocuments({ counselor: counselorId, status: 'completed' })
    ]);

    // Get upcoming appointments
    const nextAppointments = await Appointment.find({
      counselor: counselorId,
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: new Date() }
    })
      .populate('student', 'firstName lastName email')
      .sort({ date: 1 })
      .limit(5);

    // Get recent resources
    const recentResources = await Resource.find({ createdBy: counselorId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalResources,
        publishedResources,
        totalAppointments,
        pendingAppointments,
        upcomingAppointments,
        completedAppointments
      },
      nextAppointments,
      recentResources
    });
  } catch (error) {
    console.error('Get counselor dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

// ==================== RESOURCE MANAGEMENT ====================

// Get counselor's resources
export const getMyResources = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { category, type, isPublished, page = 1, limit = 10 } = req.query;

    let query = { createdBy: counselorId };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    const total = await Resource.countDocuments(query);

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      resources,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get my resources error:', error);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
};

// Create resource
export const createResource = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { 
      title, description, content, type, category, url, videoUrl, icon, 
      duration, difficulty, tags, breathingPattern, source, isFeatured, isPublished 
    } = req.body;

    const resource = new Resource({
      title,
      description,
      content,
      type: type || 'article',
      category: category || 'general',
      url,
      videoUrl,
      icon,
      duration,
      difficulty,
      tags: tags || [],
      breathingPattern,
      source,
      isFeatured: isFeatured || false,
      isPublished: isPublished !== false,
      createdBy: counselorId
    });

    await resource.save();

    res.status(201).json({ message: 'Resource created successfully', resource });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Failed to create resource' });
  }
};

// Update resource
export const updateResource = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const resource = await Resource.findOne({ _id: id, createdBy: counselorId });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or access denied' });
    }

    Object.assign(resource, updates);
    await resource.save();

    res.json({ message: 'Resource updated successfully', resource });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Failed to update resource' });
  }
};

// Delete resource
export const deleteResource = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { id } = req.params;

    const resource = await Resource.findOneAndDelete({ _id: id, createdBy: counselorId });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or access denied' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource' });
  }
};

// ==================== APPOINTMENT MANAGEMENT ====================

// Get counselor's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    let query = { counselor: counselorId };
    
    if (status) query.status = status;
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['pending', 'confirmed'] };
    }

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate('student', 'firstName lastName email')
      .sort({ date: 1, timeSlot: 1 })
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
    console.error('Get counselor appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Confirm appointment
export const confirmAppointment = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { id } = req.params;
    const { meetingLink, notes } = req.body;

    const appointment = await Appointment.findOne({ _id: id, counselor: counselorId });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'confirmed';
    if (meetingLink) appointment.meetingLink = meetingLink;
    if (notes) appointment.notes = notes;

    await appointment.save();

    const updated = await Appointment.findById(id)
      .populate('student', 'firstName lastName email');

    res.json({ message: 'Appointment confirmed', appointment: updated });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({ message: 'Failed to confirm appointment' });
  }
};

// Complete appointment
export const completeAppointment = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findOne({ _id: id, counselor: counselorId });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    if (notes) appointment.notes = notes;

    await appointment.save();

    res.json({ message: 'Appointment marked as completed' });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({ message: 'Failed to complete appointment' });
  }
};

// Cancel appointment (by counselor)
export const cancelAppointment = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findOne({ _id: id, counselor: counselorId });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = reason || 'Cancelled by counselor';
    appointment.cancelledBy = counselorId;

    await appointment.save();

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};

// ==================== FORUM MODERATION ====================

// Get posts for moderation (all posts, counselors can moderate)
export const getPostsForModeration = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await ForumPost.countDocuments(query);

    const posts = await ForumPost.find(query)
      .populate('author', 'firstName lastName email')
      .populate('category', 'name icon')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts for moderation error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Moderate a post
export const moderatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const post = await ForumPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    switch (action) {
      case 'approve':
        post.status = 'approved';
        break;
      case 'reject':
        post.status = 'rejected';
        break;
      case 'hide':
        post.isHidden = true;
        break;
      case 'unhide':
        post.isHidden = false;
        break;
      case 'pin':
        post.isPinned = true;
        break;
      case 'unpin':
        post.isPinned = false;
        break;
      case 'lock':
        post.isLocked = true;
        break;
      case 'unlock':
        post.isLocked = false;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await post.save();

    res.json({ message: `Post ${action}ed successfully`, post });
  } catch (error) {
    console.error('Moderate post error:', error);
    res.status(500).json({ message: 'Failed to moderate post' });
  }
};

// Create forum category (counselors can create)
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    const existing = await ForumCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new ForumCategory({
      name,
      description,
      icon: icon || '💬',
      color: color || '#6366f1'
    });

    await category.save();

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

// Update availability status
export const updateAvailability = async (req, res) => {
  try {
    const counselorId = req.user.id;
    const { isAvailable } = req.body;

    await User.findByIdAndUpdate(counselorId, { isAvailable });

    res.json({ message: 'Availability updated', isAvailable });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
};

// Get all students (for counselor to see)
export const getStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    let query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);

    const students = await User.find(query)
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
