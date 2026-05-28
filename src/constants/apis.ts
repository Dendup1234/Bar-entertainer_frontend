const DEFAULT_API_BASE_URL ='https://bar-entertainer-platform.vercel.app';

export const API_BASE_URL = DEFAULT_API_BASE_URL;

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: (role: string) => `/api/${role}/send-otp`,
    VERIFY_OTP: (role: string) => `/api/${role}/verify-otp`,
    LOGIN: (role: string) => `/api/${role}/login`,
    PASSWORD_RESET_SEND_OTP: (role: string) => `/api/${role}/password-reset/send-otp`,
    PASSWORD_RESET_VERIFY_OTP: (role: string) => `/api/${role}/password-reset/verify-otp`,
    PASSWORD_RESET_SET_NEW: (role: string) => `/api/${role}/password-reset/set-new`,
  },
  BAR: {
    FETCH_ENTERTAINERS: '/api/bar/entertainer',
    SEARCH_ENTERTAINERS: '/api/bar/entertainer/search/query',
    GET_DETAILS: (id: string) => `/api/bar/entertainer/${id}`,
    GET_EVENTS: '/api/bar/event',
    CREATE_EVENT: '/api/bar/event',
    GET_EVENT_COUNTS: '/api/bar/event/dashboard/count',
    DELETE_EVENT: '/api/bar/event',
    GET_EVENT_BY_ID: (id: string) => `/api/bar/event/${id}`,
    GET_BOOKING_COUNTS: '/api/bar/bookings/stats',
    GET_BOOKINGS: '/api/bar/bookings',
    CREATE_BOOKING: '/api/bar/bookings',
    SEARCH_BOOKINGS: '/api/bar/bookings/search/query',
    GET_APPLICATIONS: '/api/bar/applications',
    GET_SHORTLISTED: '/api/bar/applications/shortlisted',
    UPDATE_APPLICATION_STATUS: (id: string) => `/api/bar/applications/${id}/status`,
    GENERATE_REVIEW_TOKEN: (eventid: string) => `/api/bar/reviews/${eventid}/generate-token`,
    REGENERATE_REVIEW_TOKEN: (eventid: string) => `/api/bar/reviews/${eventid}/regenerate-token`,
    GET_REVIEW_STATS: '/api/bar/reviews/events/stats',
    GET_REVIEW_PROFILE: (eventId: string) => `/api/bar/reviews/${eventId}/profile`,
    
  },

  ENTERTAINER: {
    FETCH_EVENTS: '/api/entertainer/events',
    GET_EVENT_BY_ID: (id: string) => `/api/entertainer/events/${id}/profile`,
    APPLY_EVENT: (id: string) => `/api/entertainer/events/${id}/apply`,
    FETCH_BOOKINGS:'/api/entertainer/bookings',
    BOOKING_STATUS:(id:string) => `/api/entertainer/bookings/${id}/status`
    
  },

  PROFILE: {
    GET: (role: string) => `/api/${role}/profile`,
    UPDATE: (role: string) => `/api/${role}/profile`,
  },

  UPLOADS: {
    GET_SAS: (role: string) => `/api/${role}/uploads/sas`,
    CONFIRM: (role: string) => `/api/${role}/uploads/confirm`,
  },
};
