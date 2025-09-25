export interface WalletRepository {
  getBalance(userId: string): Promise<number>;
  credit(userId: string, amount: number): Promise<void>;
  debitWithCheck(userId: string, amount: number): Promise<'ok' | 'insufficient'>;
}