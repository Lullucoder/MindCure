import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
  getSentRequests,
  checkFriendshipStatus,
  searchUsers
} from '../controllers/friendController.js';

const friendRouter = Router();

// All routes require authentication
friendRouter.use(requireAuth);

// Search for users
friendRouter.get('/search', searchUsers);

// Get all friends
friendRouter.get('/', getFriends);

// Get pending friend requests (received)
friendRouter.get('/requests/pending', getPendingRequests);

// Get sent friend requests
friendRouter.get('/requests/sent', getSentRequests);

// Check friendship status with a user
friendRouter.get('/status/:targetUserId', checkFriendshipStatus);

// Send friend request
friendRouter.post('/request/:recipientId', sendFriendRequest);

// Accept friend request
friendRouter.patch('/accept/:friendshipId', acceptFriendRequest);

// Reject friend request
friendRouter.patch('/reject/:friendshipId', rejectFriendRequest);

// Remove friend
friendRouter.delete('/:friendId', removeFriend);

export default friendRouter;
