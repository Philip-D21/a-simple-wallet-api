import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../helpers/types';

export class TransactionService {
  constructor(private readonly transactions: TransactionRepository) {}

  async listByUser(userId: string): Promise<Transaction[]> {
    return this.transactions.listByUser(userId);
  }
}


