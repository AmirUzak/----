import { Router } from 'express';
import { checkout, getMyOrders, getAllOrders, updateOrderStatus } from './orders.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const ordersLimiter = createRateLimiter(30, 60_000);

router.use(authenticate);
router.use(ordersLimiter);

router.post('/checkout', checkout);
router.get('/', getMyOrders);
router.get('/admin/all', authorizeAdmin, getAllOrders);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

export default router;
