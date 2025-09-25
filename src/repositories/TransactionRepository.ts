import { Transaction } from '../helpers/types';

export interface TransactionRepository {
  listByUser(userId: string): Promise<Transaction[]>;
  record(userId: string, type: 'credit' | 'debit', amount: number): Promise<void>;
}


