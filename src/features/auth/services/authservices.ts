import { apiClient } from './apiClient';
import { ENDPOINTS } from '@/constants/apis';

// Define the valid UI roles
export type UserRole = 'Entertainer' | 'Event Organizer';

export const authService = {
  // Mapping UI Role names to API path segments
  getApiPath: (role: UserRole) => (role === 'Entertainer' ? 'entertainer' : 'bar'),

  sendRegistrationOtp: async (role: UserRole, userData: any) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.SEND_OTP(path), {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (role: UserRole, credentials: any) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.LOGIN(path), {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  verifyOtp: async (role: UserRole, email: string, otp: string) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.VERIFY_OTP(path), {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  sendResetOtp: async (role: UserRole, email: string) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.PASSWORD_RESET_SEND_OTP(path), {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetOtp: async (role: UserRole, email: string, otp: string) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.PASSWORD_RESET_VERIFY_OTP(path), {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  setNewPassword: async (role: UserRole, resetToken: string, newPassword: string) => {
    const path = authService.getApiPath(role);
    return await apiClient(ENDPOINTS.AUTH.PASSWORD_RESET_SET_NEW(path), {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },
};
