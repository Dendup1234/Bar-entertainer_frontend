export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://31.97.239.18:9000';

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
  },

  ENTERTAINER: {
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
