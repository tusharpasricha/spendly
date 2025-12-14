import { api } from './api';
import type { StatsData, ApiResponse } from '../types';

interface StatsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'weekly' | 'monthly' | 'yearly' | 'annually';
}

export const statsService = {
  getStats: (filters?: StatsFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return api.get<ApiResponse<StatsData>>(`/stats?${params.toString()}`);
  },
  
  getCategoryStats: (type?: 'income' | 'expense', filters?: StatsFilters) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return api.get<ApiResponse>(`/stats/category?${params.toString()}`);
  },
};

