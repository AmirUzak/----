import { Request, Response } from 'express';
import { OrderService } from './orders.service.js';

const orderService = new OrderService();

export const checkout = async (req: Request, res: Response) => {
  try {
    const order = await orderService.checkout(req.user!.id);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status is required' });
    const order = await orderService.updateStatus(orderId, status);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
