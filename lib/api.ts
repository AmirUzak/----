const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || 'Request failed');
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
}

export async function authLogin(email: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function authRegister(
  email: string,
  username: string,
  password: string,
): Promise<{ id: number; email: string; username: string }> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  });
}

export async function authLogout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' });
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    return await request<AuthUser>('/api/auth/me');
  } catch {
    return null;
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  limit: number;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<ProductsResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.category) q.set('category', params.category);
  if (params?.search) q.set('search', params.search);
  return request(`/api/products?${q.toString()}`);
}

export async function getProduct(id: number): Promise<ApiProduct> {
  return request(`/api/products/${id}`);
}

export async function getCategories(): Promise<string[]> {
  const data = await request<{ categories: string[] }>('/api/products/categories');
  return data.categories;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
}): Promise<ApiProduct> {
  return request('/api/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    category: string;
  }>,
): Promise<ApiProduct> {
  return request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProduct(id: number): Promise<void> {
  await request(`/api/products/${id}`, { method: 'DELETE' });
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface ApiCartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: ApiProduct;
}

export interface ApiCart {
  id: number;
  userId: number;
  items: ApiCartItem[];
}

export async function getCart(): Promise<ApiCart> {
  return request('/api/cart');
}

export async function addToCart(productId: number, quantity = 1): Promise<ApiCart> {
  return request('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function removeFromCart(itemId: number): Promise<ApiCart> {
  return request(`/api/cart/item/${itemId}`, { method: 'DELETE' });
}

export async function updateCartItem(itemId: number, quantity: number): Promise<ApiCart> {
  return request(`/api/cart/item/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export async function clearCart(): Promise<void> {
  await request('/api/cart', { method: 'DELETE' });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: ApiProduct;
}

export interface ApiOrder {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  user?: { id: number; email: string; username: string };
}

export async function checkout(): Promise<ApiOrder> {
  return request('/api/orders/checkout', { method: 'POST' });
}

export async function getOrders(): Promise<ApiOrder[]> {
  const data = await request<{ orders: ApiOrder[] }>('/api/orders');
  return data.orders;
}

export async function getAllOrders(): Promise<ApiOrder[]> {
  const data = await request<{ orders: ApiOrder[] }>('/api/orders/admin/all');
  return data.orders;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<ApiOrder> {
  return request(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface ApiReview {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: { id: number; username: string };
  product?: { id: number; name: string; image: string | null };
}

export async function getReviews(productId: number): Promise<ApiReview[]> {
  const data = await request<{ reviews: ApiReview[] }>(`/api/reviews/product/${productId}`);
  return data.reviews;
}

export async function getMyReviews(): Promise<ApiReview[]> {
  const data = await request<{ reviews: ApiReview[] }>('/api/reviews/my');
  return data.reviews;
}

export async function addReview(
  productId: number,
  rating: number,
  comment?: string,
): Promise<ApiReview> {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ productId, rating, comment }),
  });
}

export async function deleteReview(reviewId: number): Promise<void> {
  await request(`/api/reviews/${reviewId}`, { method: 'DELETE' });
}
