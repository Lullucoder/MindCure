import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { Resource } from '../models/Resource.js';

const resourceRouter = Router();

// Get published resources (public)
resourceRouter.get('/', async (req, res) => {
  try {
    const { category, type, featured, search, page = 1, limit = 12 } = req.query;

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
      .select('-content') // Don't send full content in list
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
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
});

// Get single resource
resourceRouter.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      isPublished: true
    });

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
});

// Like/unlike resource
resourceRouter.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const likeIndex = resource.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      resource.likes.splice(likeIndex, 1);
    } else {
      resource.likes.push(userId);
    }

    await resource.save();

    res.json({
      liked: likeIndex === -1,
      likesCount: resource.likes.length
    });
  } catch (error) {
    console.error('Like resource error:', error);
    res.status(500).json({ message: 'Failed to update like' });
  }
});

export default resourceRouter;
