// src/features/auth/services/apiClient.ts
import { API_BASE_URL } from '@/constants/apis';
import { useAuthStore } from '../store/authstore';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 1. Get current token from Zustand
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

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Optional: If you get a 401, you could trigger a logout here
    if (response.status === 401) {
       console.error("Unauthorized: Token might be expired.");
    }
    
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};