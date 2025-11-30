import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export const connectDatabase = async () => {
  if (isConnected) return mongoose.connection;

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log('\u2705 Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('\u274c MongoDB connection error:', error);
    throw error;
  }
};
