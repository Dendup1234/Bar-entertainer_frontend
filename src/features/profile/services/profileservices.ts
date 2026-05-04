import { API_BASE_URL, ENDPOINTS } from '@/constants/apis';

export const profileService = {
  getProfile: async (role: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFILE.GET(role)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  },

  updateProfile: async (role: string, token: string, profileData: any) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFILE.UPDATE(role)}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
  },

  // --- IMAGE UPLOAD HANDSHAKE ---

  // STEP 1: Get SAS URL from Backend
  getSasUrl: async (role: string, token: string, file: File) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOADS.GET_SAS(role)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        mimeType: file.type, 
        size: file.size 
      }), 
    });
    if (!response.ok) throw new Error('Failed to get SAS URL');
    return await response.json(); // Returns { sasUrl, blobName }
  },

  // STEP 2: Direct Upload to Azure Blob Storage
  uploadToAzure: async (sasUrl: string, file: File) => {
    return await fetch(sasUrl, {
      method: 'PUT', 
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
      body: file,
    });
  },

  // STEP 3: Confirm with Backend
  confirmUpload: async (role: string, token: string, blobName: string) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPLOADS.CONFIRM(role)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        blobName: blobName, 
        imageType: role 
      }), 
    });
    if (!response.ok) throw new Error('Failed to confirm upload');
    return await response.json();
  }
};