import { Request, Response } from 'express';
import { ProductService } from './products.service.js';

const productService = new ProductService();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const result = await productService.getAll(page, limit, category, search);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await productService.getById(id);
    res.json(product);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, image, category } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const product = await productService.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image,
      category,
    });
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, stock, image, category } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (stock !== undefined) data.stock = parseInt(stock);
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.category = category;
    const product = await productService.update(id, data);
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await productService.delete(id);
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await productService.getCategories();
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
