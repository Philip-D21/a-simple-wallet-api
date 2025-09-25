import { pool } from '../../db/pool';
import { UserRepository } from '../UserRepository';
import { User } from '../../helpers/types';

export class UserRepositoryPg implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT id, email, password FROM users WHERE email=$1', [email]);
    if (!rows.length) return null;
    const r = rows[0];
    return { id: r.id, email: r.email, password: r.password };
  }

  async create(email: string, password: string): Promise<Pick<User, 'id' | 'email'>> {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id, email',
      [email, password]
    );
    return rows[0];
  }
}


