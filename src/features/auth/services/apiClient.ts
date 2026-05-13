// src/features/auth/services/apiClient.ts
import { API_BASE_URL } from '@/constants/apis';
import { useAuthStore } from '../store/authstore';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const token = useAuthStore.getState().token;

  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // 2. Inject Authorization header if token exists
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 401) {
      useAuthStore.getState().logout();
    }

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) return null;

  return response.json().catch(() => null);
};
