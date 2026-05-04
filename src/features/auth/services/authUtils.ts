// src/features/auth/services/authUtils.ts
export const authUtils = {
  setRole: (role: string) => localStorage.setItem('userRole', role),
  getRole: () => localStorage.getItem('userRole'),
  clearAuth: () => localStorage.removeItem('userRole'),
};