import { User } from '../helpers/types';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(email: string, password: string): Promise<Pick<User, 'id' | 'email'>>;
}