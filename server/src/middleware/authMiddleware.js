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
