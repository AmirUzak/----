import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewService {
  async getProductReviews(productId: number) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserReviews(userId: number) {
    return prisma.review.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addReview(userId: number, productId: number, rating: number, comment?: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    // Check if user has purchased the product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId },
      },
    });
    if (!hasPurchased) throw new Error('You can only review products you have purchased');

    // Check for duplicate review
    const existing = await prisma.review.findFirst({
      where: { userId, productId },
    });
    if (existing) throw new Error('You have already reviewed this product');

    if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

    const review = await prisma.review.create({
      data: { userId, productId, rating, comment },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    // Recalculate product rating
    const avg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: { rating: avg._avg.rating ?? 0 },
    });

    return review;
  }

  async deleteReview(reviewId: number, userId: number, isAdmin: boolean) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new Error('Review not found');
    if (!isAdmin && review.userId !== userId) throw new Error('Forbidden');

    await prisma.review.delete({ where: { id: reviewId } });

    // Recalculate product rating
    const avg = await prisma.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: avg._avg.rating ?? 0 },
    });
  }
}
