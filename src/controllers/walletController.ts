import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { AuthRequest } from '../middleware/requireAuth';

const amountSchema = z.object({ amount: z.number().positive() });

export async function getBalance(req: AuthRequest | Request, res: Response) {
  const userId = (req as AuthRequest).user!.id;
  const { rows } = await pool.query('SELECT balance FROM wallets WHERE user_id=$1', [userId]);
  res.json({ balance: rows[0]?.balance ?? 0 });
}

export async function credit(req: AuthRequest | Request, res: Response) {
  const parsed = amountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount } = parsed.data;
  const userId = (req as AuthRequest).user!.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE wallets SET balance = balance + $1 WHERE user_id=$2', [amount, userId]);
    await client.query(
      'INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)',
      [userId, 'credit', amount]
    );
    await client.query('COMMIT');
    res.status(201).json({ status: 'credited' });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  } finally {
    client.release();
  }
}

export async function debit(req: AuthRequest | Request, res: Response) {
  const parsed = amountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount } = parsed.data;
  const userId = (req as AuthRequest).user!.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT balance FROM wallets WHERE user_id=$1 FOR UPDATE', [userId]);
    const balance = Number(rows[0]?.balance ?? 0);
    if (balance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    await client.query('UPDATE wallets SET balance = balance - $1 WHERE user_id=$2', [amount, userId]);
    await client.query(
      'INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)',
      [userId, 'debit', amount]
    );
    await client.query('COMMIT');
    res.status(201).json({ status: 'debited' });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  } finally {
    client.release();
  }
}


