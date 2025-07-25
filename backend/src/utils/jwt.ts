// import jwt, { JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  try {
    return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    }); 
  } catch (error) {
    throw new Error('Failed to generate token');
  }
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  try {
    const decoded = jwt.verify(token, secret) as any;
    return {
        userId: decoded.userId,
        email: decoded.email,
    };
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
};