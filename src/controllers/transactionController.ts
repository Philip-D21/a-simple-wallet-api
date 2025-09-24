import { Request, Response } from 'express';
import { pool } from '../db/pool';
import { AuthRequest } from '../middleware/requireAuth';

export async function listTransactions(req: AuthRequest | Request, res: Response) {
  const userId = (req as AuthRequest).user!.id;
  const { rows } = await pool.query(
    'SELECT id, type, amount, created_at FROM transactions WHERE user_id=$1 ORDER BY created_at DESC',
    [userId]
  );
  res.json({ transactions: rows });
}