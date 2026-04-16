import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await authService.register(email, username, password);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { token, user } = await authService.login(email, password);

    // httpOnly cookie для безопасности
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({ message: 'Logged out' });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const user = await authService.getUser(req.user.id);
  res.json(user);
};