import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { clearRefreshTokenCookie, getRefreshTokenFromRequest, setRefreshTokenCookie } from '../utils/cookies.js';
import { env } from '../config/env.js';

const normalizeEmail = (email) => email.trim().toLowerCase();

const buildAuthResponse = (user) => {
  const safeUser = user.toSafeObject();
  const accessToken = createAccessToken(safeUser.id);
  const refreshToken = createRefreshToken(safeUser.id);
  return { safeUser, accessToken, refreshToken };
};

export const signup = async (req, res, next) => {
  try {
  const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: true, message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: true, message: 'A user with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);

    const normalizedRole = ['student', 'counselor'].includes(role) ? role : 'student';

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
      role: normalizedRole
    });

    const { safeUser, accessToken, refreshToken } = buildAuthResponse(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      user: safeUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: true, message: 'Invalid credentials' });
    }

    const { safeUser, accessToken, refreshToken } = buildAuthResponse(user);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      user: safeUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const cookieToken = getRefreshTokenFromRequest(req);
    const providedToken = req.body?.refreshToken;
    const refreshToken = cookieToken || providedToken;

    if (!refreshToken) {
      return res.status(401).json({ error: true, message: 'Refresh token missing' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: true, message: 'User not found for refresh token' });
    }

    const { safeUser, accessToken, refreshToken: nextRefreshToken } = buildAuthResponse(user);
    setRefreshTokenCookie(res, nextRefreshToken);

    return res.json({
      user: safeUser,
      accessToken,
      refreshToken: nextRefreshToken
    });
  } catch (error) {
    return next({ status: 401, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};
