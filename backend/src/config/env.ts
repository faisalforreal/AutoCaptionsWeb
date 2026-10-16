import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
