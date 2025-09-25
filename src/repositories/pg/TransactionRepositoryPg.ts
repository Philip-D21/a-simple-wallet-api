import { pool } from '../../db/pool';
import { TransactionRepository } from '../TransactionRepository';
import { Transaction } from '../../helpers/types';

export class TransactionRepositoryPg implements TransactionRepository {
  async listByUser(userId: string): Promise<Transaction[]> {
    const { rows } = await pool.query(
      'SELECT id, user_id, type, amount, created_at FROM transactions WHERE user_id=$1 ORDER BY created_at DESC',
      [userId]
    );
    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      type: r.type,
      amount: Number(r.amount),
      created_at: r.created_at
    }));
  }

  async record(userId: string, type: 'credit' | 'debit', amount: number): Promise<void> {
    await pool.query('INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)', [userId, type, amount]);
  }
}


