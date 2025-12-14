import { api } from './api';
import type { Account, ApiResponse } from '../types';

export const accountService = {
  getAccounts: () => api.get<ApiResponse<{ accounts: Account[] }>>('/accounts'),
  
  getAccountById: (id: string) => api.get<ApiResponse<{ account: Account }>>(`/accounts/${id}`),
  
  createAccount: (data: Partial<Account>) => api.post<ApiResponse<{ account: Account }>>('/accounts', data),
  
  updateAccount: (id: string, data: Partial<Account>) => api.put<ApiResponse<{ account: Account }>>(`/accounts/${id}`, data),
  
  deleteAccount: (id: string) => api.delete<ApiResponse>(`/accounts/${id}`),
  
  getTotalBalance: () => api.get<ApiResponse<{ totalBalance: number }>>('/accounts/total-balance'),
};

