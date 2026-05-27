import { ENDPOINTS, API_BASE_URL } from '@/constants/apis';
import { apiClient } from '@/features/auth/services/apiClient';
import { useAuthStore } from '@/features/auth/store/authstore';

export const barService = {
    getAllEntertainers: async () => {
        return await apiClient(ENDPOINTS.BAR.FETCH_ENTERTAINERS);
    },

    createBooking: async (entertainerId: string, eventId: string) => {
        return await apiClient(ENDPOINTS.BAR.CREATE_BOOKING, {
            method: 'POST',
            body: JSON.stringify({ entertainer: entertainerId, eventId }),
        });
    },

    searchEntertainers: async (query: string) => {
        const trimmedQuery = query.trim();
        const endpoint = `${ENDPOINTS.BAR.SEARCH_ENTERTAINERS}?q=${encodeURIComponent(trimmedQuery)}`;
        return await apiClient(endpoint);
    },

    getEntertainerById: async (id: string) => {
        return await apiClient(`${ENDPOINTS.BAR.FETCH_ENTERTAINERS}/${id}`);
    },

    getEvents: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_EVENTS);
    },

    getEventById: async (id: string) => {
        return await apiClient(ENDPOINTS.BAR.GET_EVENT_BY_ID(id));
    },

    getEventCounts: async () => await apiClient(ENDPOINTS.BAR.GET_EVENT_COUNTS),

    createEvent: async (eventData: any) => {
        return await apiClient(ENDPOINTS.BAR.CREATE_EVENT, {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    },

    updateEvent: async (eventId: string, updateData: any) => {
        return await apiClient(`${ENDPOINTS.BAR.CREATE_EVENT}/${eventId}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData),
        });
    },

    deactivateEvent: async (eventId: string) => {
        const endpoint = `${ENDPOINTS.BAR.GET_EVENTS}/${eventId}`;
        return await apiClient(endpoint, { method: 'DELETE' });
    },

    generateReviewToken: async (id: string) => {
        return await apiClient(ENDPOINTS.BAR.GENERATE_REVIEW_TOKEN(id), {
            method: 'POST',
        });
    },
    
    regenerateReviewToken: async (id: string) => {
        return await apiClient(ENDPOINTS.BAR.REGENERATE_REVIEW_TOKEN(id), {
            method: 'POST',
        });
    },

    getReviewStats: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_REVIEW_STATS);
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
        return await apiClient(`${ENDPOINTS.BAR.GET_REVIEW_PROFILE(eventId)}${query ? `?${query}` : ''}`);
    },

    getAllBookings: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_BOOKINGS);
    },

    // Fetches all applications (includes pending and accepted)
    getApplications: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_APPLICATIONS);
    },

    // Fetches specifically the shortlisted candidates
    getShortlistedApplications: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_SHORTLISTED);
    },

    // Updates status to move singer through the funnel
    updateApplicationStatus: async (applicationId: string, status: 'shortlisted' | 'accepted' | 'rejected') => {
        return await apiClient(ENDPOINTS.BAR.UPDATE_APPLICATION_STATUS(applicationId), {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    getBookingCounts: async () => await apiClient(ENDPOINTS.BAR.GET_BOOKING_COUNTS),

    // --- BLOB UPLOAD (3-step handshake) ---

    // STEP 1: Get SAS URL
    getEventImageSasUrl: async (file: File) => {
        const token = useAuthStore.getState().token;
        const url = `${API_BASE_URL}${ENDPOINTS.UPLOADS.GET_SAS('bar')}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mimeType: file.type, size: file.size }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(data.message || data.error || 'Failed to get SAS URL');
        return data;
    },

    // STEP 2: Upload directly to Azure
    uploadEventImageToAzure: async (sasUrl: string, file: File) => {
        const response = await fetch(sasUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type,
            },
            body: file,
        });
        if (!response.ok) throw new Error('Failed to upload to Azure');
        return response;
    },

    // STEP 3: Confirm with backend
    confirmEventImageUpload: async (blobName: string, eventId?: string) => {
        const token = useAuthStore.getState().token;
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOADS.CONFIRM('bar')}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blobName,
                imageType: 'event',
                eventId: eventId,
            }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || data.error || 'Failed to confirm upload');
        return data;
    },
};
