import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getCategories,
  createCategory,
  getPosts,
  getPost,
  createPost,
  addComment,
  toggleLike,
  deletePost,
  getPostsForModeration,
  moderatePost
} from '../controllers/forumController.js';

const forumRouter = Router();

// Public routes (with optional auth for personalized content)
forumRouter.get('/categories', getCategories);
forumRouter.get('/posts', getPosts);
forumRouter.get('/posts/:id', getPost);

// Protected routes (require login)
forumRouter.post('/posts', requireAuth, createPost);
forumRouter.post('/posts/:id/comments', requireAuth, addComment);
forumRouter.post('/posts/:id/like', requireAuth, toggleLike);
forumRouter.delete('/posts/:id', requireAuth, deletePost);

// Admin routes
forumRouter.post('/categories', requireAuth, requireAdmin, createCategory);
forumRouter.get('/moderation/posts', requireAuth, requireAdmin, getPostsForModeration);
forumRouter.patch('/moderation/posts/:id', requireAuth, requireAdmin, moderatePost);

export default forumRouter;
