import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/requireAuth';
import { TransactionRepositoryPg } from '../repositories/pg/TransactionRepositoryPg';
import { TransactionService } from '../services/TransactionService';

const transactionService = new TransactionService(new TransactionRepositoryPg());

export async function listTransactions(req: AuthRequest | Request, res: Response) {
  const userId = (req as AuthRequest).user!.id;
  const transactions = await transactionService.listByUser(userId);
  res.json({ transactions });
}