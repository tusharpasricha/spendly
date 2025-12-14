import { api } from './api';
import { ApiResponse, Item } from '../types';

export const itemService = {
  async getItems(): Promise<ApiResponse<{ items: Item[] }>> {
    const response = await api.get<ApiResponse<{ items: Item[] }>>('/items');
    return response.data;
  },

  async getItemById(id: string): Promise<ApiResponse<{ item: Item }>> {
    const response = await api.get<ApiResponse<{ item: Item }>>(`/items/${id}`);
    return response.data;
  },

  async createItem(data: Partial<Item>): Promise<ApiResponse<{ item: Item }>> {
    const response = await api.post<ApiResponse<{ item: Item }>>('/items', data);
    return response.data;
  },

  async updateItem(id: string, data: Partial<Item>): Promise<ApiResponse<{ item: Item }>> {
    const response = await api.put<ApiResponse<{ item: Item }>>(`/items/${id}`, data);
    return response.data;
  },

  async deleteItem(id: string): Promise<ApiResponse> {
    const response = await api.delete<ApiResponse>(`/items/${id}`);
    return response.data;
  },
};

