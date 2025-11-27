const getEnv = (key, fallback) => {
  const value = process.env[key];
  if (typeof value === 'undefined' || value === null || value === '') {
    if (typeof fallback !== 'undefined') {
      return fallback;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const parseOrigins = (raw) => {
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const resolvedOrigins = parseOrigins(
  process.env.CLIENT_ORIGINS ?? process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,http://localhost:5174'
);

if (resolvedOrigins.length === 0) {
  throw new Error('At least one client origin must be configured via CLIENT_ORIGINS or CLIENT_ORIGIN');
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/mental_health',
  clientOrigins: resolvedOrigins,
  clientOrigin: resolvedOrigins[0],
  accessTokenSecret: getEnv('JWT_ACCESS_SECRET'),
  refreshTokenSecret: getEnv('JWT_REFRESH_SECRET'),
  accessTokenExpiresIn: getEnv('ACCESS_TOKEN_EXPIRES_IN', '15m'),
  refreshTokenExpiresIn: getEnv('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  bcryptSaltRounds: Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12
};
