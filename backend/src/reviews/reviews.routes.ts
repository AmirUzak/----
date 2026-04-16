import { Router } from 'express';
import { getProductReviews, getMyReviews, addReview, deleteReview } from './reviews.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const reviewsLimiter = createRateLimiter(30, 60_000);

router.get('/product/:productId', getProductReviews);
router.get('/my', authenticate, reviewsLimiter, getMyReviews);
router.post('/', authenticate, reviewsLimiter, addReview);
router.delete('/:id', authenticate, reviewsLimiter, deleteReview);

export default router;
