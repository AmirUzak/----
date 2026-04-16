import { Request, Response, NextFunction } from 'express';

const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

/**
 * CSRF protection middleware using Origin/Referer header validation.
 * Applies to state-changing requests (POST, PUT, PATCH, DELETE).
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();

  const origin = req.headers.origin || req.headers.referer;
  if (!origin) {
    return res.status(403).json({ error: 'CSRF check failed: missing Origin header' });
  }

  const allowed = ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
  if (!allowed) {
    return res.status(403).json({ error: 'CSRF check failed: origin not allowed' });
  }

  next();
}
