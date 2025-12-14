import { api } from './api';
import type { Transaction, ApiResponse } from '../types';

interface TransactionFilters {
  account?: string;
  category?: string;
  type?: 'income' | 'expense';
  startDate?: string;
  endDate?: string;
}

export const transactionService = {
  getTransactions: (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return api.get<ApiResponse<{ transactions: Transaction[] }>>(`/transactions?${params.toString()}`);
  },
  
  getTransactionById: (id: string) => api.get<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`),
  
  createTransaction: (data: Partial<Transaction>) => api.post<ApiResponse<{ transaction: Transaction }>>('/transactions', data),
  
  updateTransaction: (id: string, data: Partial<Transaction>) => api.put<ApiResponse<{ transaction: Transaction }>>(`/transactions/${id}`, data),
  
  deleteTransaction: (id: string) => api.delete<ApiResponse>(`/transactions/${id}`),
  
  getTransactionsByDate: (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return api.get<ApiResponse>(`/transactions/by-date?${params.toString()}`);
  },
};

