import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';


export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}


export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}


export function signJwt(payload: object, expiresIn: string | number = '1d'): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: expiresIn as any });
}


export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, env.jwtSecret) as T;
}