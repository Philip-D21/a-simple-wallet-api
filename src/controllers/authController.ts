import { Request, Response } from 'express';
import { authSchema } from '../utils/validation';
import { UserRepositoryPg } from '../repositories/pg/UserRepositoryPg';
import { AuthService } from '../services/AuthService';

const authService = new AuthService(new UserRepositoryPg());

export async function signup(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  try {
    const result = await authService.signup(email, password);
    res.status(201).json(result);
  } catch (e: any) {
    if (e?.message === 'EMAIL_IN_USE') return res.status(409).json({ error: 'Email already registered' });
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (e: any) {
    if (e?.message === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'Invalid credentials' });
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
}


