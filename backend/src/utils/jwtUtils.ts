import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'default_secret_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  // @ts-ignore - bypassing TypeScript checking for JWT sign
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    
    // @ts-ignore - bypassing TypeScript checking for JWT verify
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
}; 