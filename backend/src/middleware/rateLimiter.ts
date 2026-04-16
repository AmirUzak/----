import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks.
// The interval reference is kept so it can be cleared if needed.
export const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

// Prevent the interval from keeping the process alive in test/serverless environments.
if (cleanupInterval.unref) cleanupInterval.unref();

/**
 * Simple in-memory rate limiter.
 * @param maxRequests Maximum requests allowed in the window
 * @param windowMs Window size in milliseconds
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    if (!ip) {
      // Reject requests with no identifiable IP to prevent bypass
      return res.status(400).json({ error: 'Unable to identify request origin' });
    }

    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || entry.resetAt < now) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests, please try again later' });
    }

    next();
  };
}
