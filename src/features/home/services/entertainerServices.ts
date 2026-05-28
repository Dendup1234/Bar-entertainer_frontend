import { ENDPOINTS } from '@/constants/apis';
import { apiClient } from '@/features/auth/services/apiClient';

export const entertainerServices = {

  getEvents: async () => {
    return await apiClient(ENDPOINTS.ENTERTAINER.FETCH_EVENTS);
  },

  getEventById: async (eventId: string) => {
    return await apiClient(ENDPOINTS.ENTERTAINER.GET_EVENT_BY_ID(eventId));
  },

  applyForEvent: async (eventId: string) => {
    return await apiClient(ENDPOINTS.ENTERTAINER.APPLY_EVENT(eventId), {
      method: 'POST',
    });
  },

  getApplications: async (status?: 'pending' | 'shortlisted' | 'accepted' | 'rejected') => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return await apiClient(`${ENDPOINTS.ENTERTAINER.FETCH_APPLICATIONS}${query}`);
  },

  getReviewStats: async () => {
    return await apiClient(ENDPOINTS.ENTERTAINER.GET_REVIEW_STATS);
  },

  getReviewProfile: async (
    eventId: string,
    params?: { cursorCreatedAt?: string; cursorId?: string; limit?: number },
  ) => {
    const searchParams = new URLSearchParams();

    if (params?.cursorCreatedAt) searchParams.set('cursorCreatedAt', params.cursorCreatedAt);
    if (params?.cursorId) searchParams.set('cursorId', params.cursorId);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    return await apiClient(`${ENDPOINTS.ENTERTAINER.GET_REVIEW_PROFILE(eventId)}${query ? `?${query}` : ''}`);
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
