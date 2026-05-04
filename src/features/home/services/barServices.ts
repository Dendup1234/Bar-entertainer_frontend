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

    getAllBookings: async () => {
        return await apiClient(ENDPOINTS.BAR.GET_BOOKINGS);
    },

    getBookingCounts: async () => await apiClient(ENDPOINTS.BAR.GET_BOOKING_COUNTS),

    // --- BLOB UPLOAD (3-step handshake) ---

    // STEP 1: Get SAS URL
    getEventImageSasUrl: async (file: File) => {
        const token = useAuthStore.getState().token;
        const url = `${API_BASE_URL}${ENDPOINTS.UPLOADS.GET_SAS('bar')}`;

        console.log('=== SAS URL DEBUG ===');
        console.log('Full URL:', url);
        console.log('Token exists:', !!token);
        console.log('Token value:', token);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mimeType: file.type, size: file.size }),
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const data = await response.json();
        console.log('Response body:', data);

        if (!response.ok) throw new Error('Failed to get SAS URL');
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
        if (!response.ok) throw new Error('Failed to confirm upload');
        return await response.json();
    },
};