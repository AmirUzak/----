import prisma from '../utils/prisma.js';

export class ProductsService {
  async getAll(page: number = 1, limit: number = 10, category?: string, search?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  async getById(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error('Product not found');
    return product;
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    category?: string;
  }) {
    return prisma.product.create({ data });
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      image?: string;
      category?: string;
    },
  ) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('Product not found');
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: number) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('Product not found');
    return prisma.product.delete({ where: { id } });
  }

  async getCategories() {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return products.map((p: { category: string | null }) => p.category).filter(Boolean);
  }
}