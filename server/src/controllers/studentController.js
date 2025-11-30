import { Resource } from '../models/Resource.js';
import { Appointment } from '../models/Appointment.js';
import { ForumPost } from '../models/ForumPost.js';
import { ForumCategory } from '../models/ForumCategory.js';
import { User } from '../models/User.js';

// ==================== DASHBOARD ====================

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student's stats
    const [
      upcomingAppointments,
      completedAppointments,
      totalPosts,
      featuredResources
    ] = await Promise.all([
      Appointment.countDocuments({ 
        student: studentId, 
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: new Date() }
      }),
      Appointment.countDocuments({ student: studentId, status: 'completed' }),
      ForumPost.countDocuments({ author: studentId, isHidden: false }),
      Resource.find({ isPublished: true, isFeatured: true }).limit(4)
    ]);

    // Get next appointment
    const nextAppointment = await Appointment.findOne({
      student: studentId,
      status: { $in: ['pending', 'confirmed'] },
      date: { $gte: new Date() }
    })
      .populate('counselor', 'firstName lastName email specializations')
      .sort({ date: 1 });

    // Get recent resources
    const recentResources = await Resource.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: {
        upcomingAppointments,
        completedAppointments,
        totalPosts
      },
      nextAppointment,
      featuredResources,
      recentResources
    });
  } catch (error) {
    console.error('Get student dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

// ==================== RESOURCES (VIEW ONLY) ====================

// Get all published resources
export const getResources = async (req, res) => {
  try {
    const { category, type, search, featured, page = 1, limit = 12 } = req.query;

    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (featured === 'true') query.isFeatured = true;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Resource.countDocuments(query);

    const resources = await Resource.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ isFeatured: -1, createdAt: -1 })
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

// Get single resource
export const getResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOne({ _id: id, isPublished: true })
      .populate('createdBy', 'firstName lastName');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment view count
    resource.views += 1;
    await resource.save();

    res.json({ resource });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Failed to fetch resource' });
  }
};

// Like/unlike resource
export const toggleResourceLike = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const likeIndex = resource.likes.indexOf(studentId);
    
    if (likeIndex > -1) {
      resource.likes.splice(likeIndex, 1);
    } else {
      resource.likes.push(studentId);
    }

    await resource.save();

    res.json({
      liked: likeIndex === -1,
      likesCount: resource.likes.length
    });
  } catch (error) {
    console.error('Toggle resource like error:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
};

// ==================== APPOINTMENTS ====================

// Get available counselors
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

// Get available time slots
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

    const existingAppointments = await Appointment.find({
      counselor: counselorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);

    const allSlots = [
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '13:00-14:00',
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

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { counselorId, date, timeSlot, type, reason } = req.body;

    // Validate counselor
    const counselor = await User.findOne({ _id: counselorId, role: 'counselor', isAvailable: true });
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found or not available' });
    }

    // Check if slot is available
    const existing = await Appointment.findOne({
      counselor: counselorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existing) {
      return res.status(400).json({ message: 'This time slot is no longer available' });
    }

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

    const populated = await Appointment.findById(appointment._id)
      .populate('counselor', 'firstName lastName email specializations')
      .populate('student', 'firstName lastName email');

    res.status(201).json({ 
      message: 'Appointment booked successfully',
      appointment: populated 
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
};

// Get my appointments (student)
export const getMyAppointments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status, upcoming, page = 1, limit = 10 } = req.query;

    let query = { student: studentId };
    
    if (status) query.status = status;
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = { $in: ['pending', 'confirmed'] };
    }

    const total = await Appointment.countDocuments(query);

    const appointments = await Appointment.find(query)
      .populate('counselor', 'firstName lastName email specializations')
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
    console.error('Get student appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Cancel appointment (student)
export const cancelAppointment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findOne({ _id: id, student: studentId });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ message: 'Cannot cancel this appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = reason || 'Cancelled by student';
    appointment.cancelledBy = studentId;

    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};

// ==================== FORUM ====================

// Get forum categories
export const getCategories = async (req, res) => {
  try {
    const categories = await ForumCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

// Get posts
export const getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, sort = 'latest' } = req.query;

    let query = { status: 'approved', isHidden: false };
    
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortQuery = {};
    switch (sort) {
      case 'popular': sortQuery = { views: -1 }; break;
      case 'mostLiked': sortQuery = { likesCount: -1 }; break;
      case 'active': sortQuery = { lastActivityAt: -1 }; break;
      default: sortQuery = { isPinned: -1, createdAt: -1 };
    }

    const total = await ForumPost.countDocuments(query);

    const posts = await ForumPost.find(query)
      .populate('author', 'firstName lastName')
      .populate('category', 'name icon color')
      .select('-comments')
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Handle anonymous posts
    const processedPosts = posts.map(post => {
      const obj = post.toObject();
      if (obj.isAnonymous) {
        obj.author = { firstName: 'Anonymous', lastName: '' };
      }
      obj.likesCount = obj.likes?.length || 0;
      obj.commentsCount = obj.comments?.length || 0;
      return obj;
    });

    res.json({
      posts: processedPosts,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await ForumPost.findById(id)
      .populate('author', 'firstName lastName')
      .populate('category', 'name icon color')
      .populate('comments.author', 'firstName lastName');

    if (!post || post.isHidden) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.views += 1;
    await post.save();

    const obj = post.toObject();
    if (obj.isAnonymous) {
      obj.author = { firstName: 'Anonymous', lastName: '' };
    }

    // Handle anonymous comments
    obj.comments = obj.comments
      .filter(c => !c.isHidden)
      .map(c => {
        if (c.isAnonymous) c.author = { firstName: 'Anonymous', lastName: '' };
        return c;
      });

    res.json({ post: obj });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { title, content, category, isAnonymous, tags } = req.body;

    // Category is optional - validate if provided
    let categoryDoc = null;
    if (category) {
      categoryDoc = await ForumCategory.findById(category);
      if (!categoryDoc || !categoryDoc.isActive) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    const post = new ForumPost({
      title,
      content,
      author: studentId,
      category: category || null,
      isAnonymous: isAnonymous || false,
      tags: tags || [],
      status: 'approved' // Auto-approve for now
    });

    await post.save();

    // Update category post count if category was provided
    if (category) {
      await ForumCategory.findByIdAndUpdate(category, { $inc: { postCount: 1 } });
    }

    const populated = await ForumPost.findById(post._id)
      .populate('author', 'firstName lastName')
      .populate('category', 'name icon color');

    res.status(201).json({ message: 'Post created', post: populated });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;
    const { content, isAnonymous } = req.body;

    const post = await ForumPost.findById(id);
    
    if (!post || post.isHidden || post.isLocked) {
      return res.status(404).json({ message: 'Post not found or locked' });
    }

    post.comments.push({
      author: studentId,
      content,
      isAnonymous: isAnonymous || false
    });

    post.lastActivityAt = new Date();
    await post.save();

    const updated = await ForumPost.findById(id)
      .populate('comments.author', 'firstName lastName');

    res.status(201).json({ message: 'Comment added', comments: updated.comments });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Like post
export const togglePostLike = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const post = await ForumPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(studentId);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(studentId);
    }

    await post.save();

    res.json({ liked: likeIndex === -1, likesCount: post.likes.length });
  } catch (error) {
    console.error('Toggle post like error:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
};

// Delete own post
export const deletePost = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    const post = await ForumPost.findOne({ _id: id, author: studentId });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found or access denied' });
    }

    post.isHidden = true;
    await post.save();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};
