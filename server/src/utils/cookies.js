const REFRESH_TOKEN_COOKIE = 'mindcure_refresh_token';

export const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth/refresh',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    path: '/api/auth/refresh'
  });
};

export const getRefreshTokenFromRequest = (req) => {
  return req.cookies?.[REFRESH_TOKEN_COOKIE];
};
