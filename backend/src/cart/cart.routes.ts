import { Router } from 'express';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart } from './cart.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/item/:id', removeFromCart);
router.put('/item/:id', updateCartItem);
router.delete('/', clearCart);

export default router;
