import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.js';

const unauthorized = (res, message = 'Authentication required') => {
  return res.status(401).json({ error: true, message });
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
      return unauthorized(res, 'User no longer exists');
    }

    req.user = user;
    return next();
  } catch (error) {
    return unauthorized(res, 'Invalid or expired token');
  }
};

// Role-based access control middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: true, message: 'Access denied. Insufficient permissions.' });
    }
    
    return next();
  };
};

// Shorthand middleware for admin-only routes
export const requireAdmin = requireRole('admin');

// Shorthand middleware for counselor or admin
export const requireCounselor = requireRole('counselor', 'admin');

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    // ignore invalid token for optional auth
  }

  return next();
};
