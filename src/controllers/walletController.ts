import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import { amountSchema } from '../utils/validation';
import { WalletRepositoryPg } from '../repositories/pg/WalletRepositoryPg';
import { WalletService } from '../services/WalletService';

const walletService = new WalletService(new WalletRepositoryPg());

export async function getBalance(req: AuthRequest | Request, res: Response) {
  const userId = (req as AuthRequest).user!.id;
  const balance = await walletService.getBalance(userId);
  res.json({ balance });
}

export async function credit(req: AuthRequest | Request, res: Response) {
  const parsed = amountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount } = parsed.data;
  const userId = (req as AuthRequest).user!.id;
  try {
    await walletService.credit(userId, amount);
    res.status(201).json({ status: 'credited' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
}

export async function debit(req: AuthRequest | Request, res: Response) {
  const parsed = amountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount } = parsed.data;
  const userId = (req as AuthRequest).user!.id;
  try {
    const result = await walletService.debit(userId, amount);
    if (result === 'insufficient') return res.status(400).json({ error: 'Insufficient funds' });
    res.status(201).json({ status: 'debited' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
}


