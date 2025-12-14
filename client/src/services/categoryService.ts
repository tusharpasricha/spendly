import { api } from './api';
import type { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: () => api.get<ApiResponse<{ categories: Category[] }>>('/categories'),
  
  getCategoryById: (id: string) => api.get<ApiResponse<{ category: Category }>>(`/categories/${id}`),
  
  createCategory: (data: Partial<Category>) => api.post<ApiResponse<{ category: Category }>>('/categories', data),
  
  updateCategory: (id: string, data: Partial<Category>) => api.put<ApiResponse<{ category: Category }>>(`/categories/${id}`, data),
  
  deleteCategory: (id: string) => api.delete<ApiResponse>(`/categories/${id}`),
  
  initializeDefaultCategories: () => api.post<ApiResponse>('/categories/initialize'),
};

