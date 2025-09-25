export interface User {
  id: string;
  email: string;
  password?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
}

export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  created_at: string;
}


