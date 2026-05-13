// src/features/auth/services/authUtils.ts
export const authUtils = {
  setRole: (role: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('userRole', role);
  },
  getRole: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userRole');
  },
  clearAuth: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('userRole');
  },
};
