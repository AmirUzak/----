import { Router } from 'express';
import { getProductReviews, getMyReviews, addReview, deleteReview } from './reviews.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.get('/my', authenticate, getMyReviews);
router.post('/', authenticate, addReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
