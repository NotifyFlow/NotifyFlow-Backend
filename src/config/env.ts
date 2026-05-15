import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

export const env = {
  JWT_SECRET:process.env.JWT_SECRET,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL!,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!,
  DATABASE_URL:process.env.DATABASE_URL! ,
  REALTIME_JWT_SECRET:process.env.REALTIME_JWT_SECRET!,
  RESEND_API_KEY:process.env.RESEND_API_KEY!,
  MASTER_ENCRYPTION_KEY:process.env.MASTER_ENCRYPTION_KEY!,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID
};