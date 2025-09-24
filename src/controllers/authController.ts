import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { hashPassword, verifyPassword, signJwt } from '../utils/auth';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function signup(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rowCount) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await hashPassword(password);
    const userRes = await client.query(
      'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id, email',
      [email, passwordHash]
    );
    const user = userRes.rows[0];
    await client.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 0)', [user.id]);
    const token = signJwt({ id: user.id, email: user.email });
    res.status(201).json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  } finally {
    client.release();
  }
}

export async function login(req: Request, res: Response) {
  const parsed = authSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;

  const userRes = await pool.query('SELECT id, email, password FROM users WHERE email=$1', [email]);
  if (!userRes.rowCount) return res.status(401).json({ error: 'Invalid credentials' });
  const user = userRes.rows[0];
  const ok = await verifyPassword(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
}


