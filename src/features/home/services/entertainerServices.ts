import { ENDPOINTS } from '@/constants/apis';
import { apiClient } from '@/features/auth/services/apiClient';

export const entertainerServices = {

  getEvents: async () => {
    return await apiClient(ENDPOINTS.ENTERTAINER.FETCH_EVENTS);
  },
applyForEvent: async (eventId: string) => {
    return await apiClient(ENDPOINTS.ENTERTAINER.APPLY_EVENT(eventId), {
      method: 'POST',
    });
  },
  

  getAllBookings: async () => {
    return await apiClient(ENDPOINTS.ENTERTAINER.FETCH_BOOKINGS);
  },

  updateBookingStatus: async (bookingId: string, status: 'accepted' | 'rejected') => {
    return await apiClient(ENDPOINTS.ENTERTAINER.BOOKING_STATUS(bookingId), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

};