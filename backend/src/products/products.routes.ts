import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from './products.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import { createRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const adminLimiter = createRateLimiter(30, 60_000);

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', authenticate, authorizeAdmin, adminLimiter, createProduct);
router.put('/:id', authenticate, authorizeAdmin, adminLimiter, updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, adminLimiter, deleteProduct);

export default router;
