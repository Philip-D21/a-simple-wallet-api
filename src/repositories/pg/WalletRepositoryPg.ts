import { pool } from '../../db/pool';
import { WalletRepository } from '../WalletRepository';

export class WalletRepositoryPg implements WalletRepository {
  async getBalance(userId: string): Promise<number> {
    const { rows } = await pool.query('SELECT balance FROM wallets WHERE user_id=$1', [userId]);
    return Number(rows[0]?.balance ?? 0);
  }

  async credit(userId: string, amount: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE wallets SET balance = balance + $1 WHERE user_id=$2', [amount, userId]);
      await client.query('INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)', [userId, 'credit', amount]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async debitWithCheck(userId: string, amount: number): Promise<'ok' | 'insufficient'> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query('SELECT balance FROM wallets WHERE user_id=$1 FOR UPDATE', [userId]);
      const balance = Number(rows[0]?.balance ?? 0);
      if (balance < amount) {
        await client.query('ROLLBACK');
        return 'insufficient';
      }
      await client.query('UPDATE wallets SET balance = balance - $1 WHERE user_id=$2', [amount, userId]);
      await client.query('INSERT INTO transactions (user_id, type, amount) VALUES ($1,$2,$3)', [userId, 'debit', amount]);
      await client.query('COMMIT');
      return 'ok';
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}


