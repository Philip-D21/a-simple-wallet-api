import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, verifyPassword, signJwt } from '../utils/auth';
import { User } from '../helpers/types';

export class AuthService {
  constructor(private readonly users: UserRepository) {}

  async signup(email: string, password: string): Promise<{ token: string; user: Pick<User, 'id' | 'email'> }> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error('EMAIL_IN_USE');
    const passwordHash = await hashPassword(password);
    const user = await this.users.create(email, passwordHash);
    const token = signJwt({ id: user.id, email: user.email });
    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: Pick<User, 'id' | 'email'> }> {
    const user = await this.users.findByEmail(email);
    if (!user || !user.password) throw new Error('INVALID_CREDENTIALS');
    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new Error('INVALID_CREDENTIALS');
    const token = signJwt({ id: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email } };
  }
}


