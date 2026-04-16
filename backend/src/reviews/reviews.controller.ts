import { Request, Response } from 'express';
import { ReviewService } from './reviews.service.js';

const reviewService = new ReviewService();

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await reviewService.getProductReviews(productId);
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getUserReviews(req.user!.id);
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ error: 'productId and rating are required' });
    }
    const review = await reviewService.addReview(
      req.user!.id,
      parseInt(productId),
      parseInt(rating),
      comment,
    );
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const isAdmin = req.user!.role === 'admin';
    await reviewService.deleteReview(reviewId, req.user!.id, isAdmin);
    res.json({ message: 'Review deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
