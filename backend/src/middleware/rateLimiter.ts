import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Limit each IP to 100 requests per windowMs
  
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  // Clean up expired entries
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
  
  // Initialize or get current count for this IP
  if (!store[ip]) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs
    };
  } else if (store[ip].resetTime < now) {
    // Reset if window has expired
    store[ip] = {
      count: 1,
      resetTime: now + windowMs
    };
  } else {
    // Increment count
    store[ip].count++;
  }
  
  // Set headers
  res.set({
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, maxRequests - store[ip].count).toString(),
    'X-RateLimit-Reset': new Date(store[ip].resetTime).toISOString(),
  });
  
  // Check if limit exceeded
  if (store[ip].count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
      retryAfter: Math.round((store[ip].resetTime - now) / 1000),
    });
  }
  
  next();
};