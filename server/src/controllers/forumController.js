import { ForumCategory } from '../models/ForumCategory.js';
import { ForumPost } from '../models/ForumPost.js';

// ==================== CATEGORIES ====================

// Get all categories
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

// Create category (admin only)
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

// ==================== POSTS ====================

// Get posts (with filters)
export const getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, sort = 'latest' } = req.query;

    let query = { status: 'approved', isHidden: false };
    
    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    let sortQuery = {};
    switch (sort) {
      case 'popular':
        sortQuery = { views: -1 };
        break;
      case 'mostLiked':
        sortQuery = { 'likes.length': -1 };
        break;
      case 'active':
        sortQuery = { lastActivityAt: -1 };
        break;
      default:
        sortQuery = { isPinned: -1, createdAt: -1 };
    }

    const total = await ForumPost.countDocuments(query);

    const posts = await ForumPost.find(query)
      .populate('author', 'firstName lastName')
      .populate('category', 'name icon color')
      .select('-comments') // Don't load comments in list view
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Handle anonymous posts
    const processedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.isAnonymous) {
        postObj.author = { firstName: 'Anonymous', lastName: '' };
      }
      return postObj;
    });

    res.json({
      posts: processedPosts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

// Get single post with comments
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

    // Increment view count
    post.views += 1;
    await post.save();

    // Handle anonymous
    const postObj = post.toObject();
    if (postObj.isAnonymous) {
      postObj.author = { firstName: 'Anonymous', lastName: '' };
    }

    // Handle anonymous comments
    postObj.comments = postObj.comments
      .filter(c => !c.isHidden)
      .map(comment => {
        if (comment.isAnonymous) {
          comment.author = { firstName: 'Anonymous', lastName: '' };
        }
        return comment;
      });

    res.json({ post: postObj });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, isAnonymous, tags } = req.body;
    const userId = req.user.id;

    // Validate category
    const categoryDoc = await ForumCategory.findById(category);
    if (!categoryDoc || !categoryDoc.isActive) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const post = new ForumPost({
      title,
      content,
      author: userId,
      category,
      isAnonymous: isAnonymous || false,
      tags: tags || []
    });

    await post.save();

    // Update category post count
    await ForumCategory.findByIdAndUpdate(category, {
      $inc: { postCount: 1 }
    });

    const populated = await ForumPost.findById(post._id)
      .populate('author', 'firstName lastName')
      .populate('category', 'name icon color');

    res.status(201).json({ message: 'Post created', post: populated });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isAnonymous } = req.body;
    const userId = req.user.id;

    const post = await ForumPost.findById(id);
    
    if (!post || post.isHidden) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.isLocked) {
      return res.status(403).json({ message: 'This post is locked' });
    }

    post.comments.push({
      author: userId,
      content,
      isAnonymous: isAnonymous || false
    });

    post.lastActivityAt = new Date();
    await post.save();

    const updated = await ForumPost.findById(id)
      .populate('comments.author', 'firstName lastName');

    res.status(201).json({ 
      message: 'Comment added',
      comments: updated.comments 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Like/unlike post
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await ForumPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ 
      liked: likeIndex === -1,
      likesCount: post.likes.length 
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
};

// Delete post (owner or admin)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await ForumPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Only author or admin can delete
    if (post.author.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Soft delete
    post.isHidden = true;
    await post.save();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// ==================== ADMIN ====================

// Get all posts for moderation
export const getPostsForModeration = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const query = status === 'all' ? {} : { status };

    const total = await ForumPost.countDocuments(query);

    const posts = await ForumPost.find(query)
      .populate('author', 'firstName lastName email')
      .populate('category', 'name')
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

// Moderate post (approve/reject/pin/lock)
export const moderatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

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
