import { Router } from 'express';
import { checkout, getMyOrders, getAllOrders, updateOrderStatus } from './orders.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';

const router = Router();

router.use(authenticate);

router.post('/checkout', checkout);
router.get('/', getMyOrders);
router.get('/admin/all', authorizeAdmin, getAllOrders);
router.put('/:id/status', authorizeAdmin, updateOrderStatus);

export default router;
