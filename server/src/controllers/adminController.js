import { User } from '../models/User.js';
import { Appointment } from '../models/Appointment.js';
import { ForumPost } from '../models/ForumPost.js';
import { ForumCategory } from '../models/ForumCategory.js';
import { Resource } from '../models/Resource.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalCounselors,
      totalAppointments,
      pendingAppointments,
      totalPosts,
      totalResources
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'counselor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      ForumPost.countDocuments({ isHidden: false }),
      Resource.countDocuments({ isPublished: true })
    ]);

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('student', 'firstName lastName')
      .populate('counselor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent forum posts
    const recentPosts = await ForumPost.find({ isHidden: false })
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalCounselors,
        totalAppointments,
        pendingAppointments,
        totalPosts,
        totalResources
      },
      recentAppointments,
      recentPosts
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (role) query.role = role;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'counselor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// ==================== RESOURCES MANAGEMENT ====================

// Get all resources (admin)
export const getResources = async (req, res) => {
  try {
    const { category, type, isPublished, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';

    const total = await Resource.countDocuments(query);

    const resources = await Resource.find(query)
      .populate('author', 'firstName lastName')
      .sort({ order: 1, createdAt: -1 })
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
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Failed to fetch resources' });
  }
};

// Create resource
export const createResource = async (req, res) => {
  try {
    const { title, description, content, type, category, url, duration, tags, isFeatured } = req.body;
    const authorId = req.user.id;

    const resource = new Resource({
      title,
      description,
      content,
      type: type || 'article',
      category: category || 'general',
      url,
      duration,
      tags: tags || [],
      isFeatured: isFeatured || false,
      author: authorId
    });

    await resource.save();

    res.status(201).json({ message: 'Resource created', resource });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Failed to create resource' });
  }
};

// Update resource
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const resource = await Resource.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource updated', resource });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Failed to update resource' });
  }
};

// Delete resource
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Failed to delete resource' });
  }
};

// ==================== FORUM CATEGORIES MANAGEMENT ====================

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await ForumCategory.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has posts
    const postsCount = await ForumPost.countDocuments({ category: id });
    
    if (postsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing posts. Move or delete posts first.' 
      });
    }

    const category = await ForumCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};
