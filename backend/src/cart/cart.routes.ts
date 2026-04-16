import { Router } from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from './cart.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const cartLimiter = createRateLimiter(60, 60_000);

router.use(authenticate);
router.use(cartLimiter);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/item/:id', removeFromCart);
router.put('/item/:id', updateCartItem);
router.delete('/', clearCart);

export default router;
