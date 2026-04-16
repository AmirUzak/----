import { Request, Response } from 'express';
import { CartService } from './cart.service.js';

const cartService = new CartService();

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.json(cart || { items: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    const cart = await cartService.addItem(req.user!.id, parseInt(productId), parseInt(quantity));
    res.json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const cart = await cartService.removeItem(req.user!.id, itemId);
    res.json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'quantity is required' });
    const cart = await cartService.updateItem(req.user!.id, itemId, parseInt(quantity));
    res.json(cart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    await cartService.clearCart(req.user!.id);
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
