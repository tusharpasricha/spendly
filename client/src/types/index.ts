export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// Account types
export interface Account {
  _id: string;
  name: string;
  balance: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Transaction types
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string | Category;
  account: string | Account;
  accountDetails?: Account;
  categoryDetails?: Category;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category types
export type CategoryType = 'income' | 'expense' | 'both';

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  createdAt?: string;
  updatedAt?: string;
}

// Stats types
export interface MonthlyStats {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryStats {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface StatsData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategoryStats[];
  monthlyTrend: MonthlyStats[];
}

