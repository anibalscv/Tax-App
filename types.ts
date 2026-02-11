export type TaxStatus = 'pending' | 'paid' | 'overdue';

export interface LinkedAccount {
  bank: string;
  last_four: string;
  type: 'credit' | 'debit';
}

export interface User {
  id: string;
  full_name: string;
  tax_id: string;
  email: string;
  linked_accounts: LinkedAccount[];
  isAuthenticated: boolean;
  biometricVerified: boolean;
}

export interface TaxRecord {
  id: string;
  type: string;
  period: string;
  amount: number;
  currency: string;
  due_date: string;
  status: TaxStatus;
  receipt_url?: string;
}

export interface AppState {
  user: User | null;
  tax_records: TaxRecord[];
}