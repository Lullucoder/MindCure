import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const createAccessToken = (userId) => {
  return jwt.sign(
    {
      sub: userId,
      type: 'access'
    },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiresIn }
  );
};

export const createRefreshToken = (userId) => {
  return jwt.sign(
    {
      sub: userId,
      type: 'refresh'
    },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiresIn }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.accessTokenSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.refreshTokenSecret);
};
