import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderService {
  async checkout(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${item.product.name}`);
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  }

  async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true, username: true } },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(orderId: number, status: string) {
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) throw new Error('Invalid status');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');

    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
