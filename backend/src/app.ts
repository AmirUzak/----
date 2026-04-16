import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './auth/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/orders.routes.js';
import reviewRoutes from './routes/reviews.routes.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { csrfProtection } from './middleware/csrfProtection.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// CSRF protection for all state-changing requests
app.use(csrfProtection);

// Global rate limiter: 200 requests per minute per IP
const globalLimiter = createRateLimiter(200, 60_000);
app.use(globalLimiter);

// Stricter rate limiter for auth endpoints: 20 requests per minute
const authLimiter = createRateLimiter(20, 60_000);
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;