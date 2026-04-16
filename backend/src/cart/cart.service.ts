import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CartService {
  async getCart(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return cart;
  }

  async addItem(userId: number, productId: number, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
    if (product.stock < quantity) throw new Error('Not enough stock');

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new Error('Item not found');

    await prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async updateItem(userId: number, itemId: number, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new Error('Item not found');

    if (quantity < 1) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }

    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
