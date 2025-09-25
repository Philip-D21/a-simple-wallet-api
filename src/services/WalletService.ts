import { WalletRepository } from '../repositories/WalletRepository';

export class WalletService {
  constructor(private readonly wallets: WalletRepository) {}

  async getBalance(userId: string): Promise<number> {
    return this.wallets.getBalance(userId);
  }

  async credit(userId: string, amount: number): Promise<void> {
    await this.wallets.credit(userId, amount);
  }

  async debit(userId: string, amount: number): Promise<'ok' | 'insufficient'> {
    return this.wallets.debitWithCheck(userId, amount);
  }
}


