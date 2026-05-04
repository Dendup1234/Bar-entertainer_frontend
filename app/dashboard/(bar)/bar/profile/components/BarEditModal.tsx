"use client";
import React, { useState, useRef } from 'react';
import { profileService } from '@/features/profile/services/profileservices';

export const BarEditModal = ({ isOpen, onClose, user, onSaveSuccess }: any) => {
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    ownerName: user?.ownerName || '',
    phone: user?.phone || '',
    venueType: user?.venueType || '',
    address: user?.address || '',
    description: user?.description || '',
    profileImage: user?.profileImage || ''
  });
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const stored = localStorage.getItem('auth-storage');
    const token = stored ? JSON.parse(stored).state?.token : '';

    try {
      // Step 1: Request SAS URL
      const { sasUrl, blobName } = await profileService.getSasUrl('bar', token, file);

      // Step 2: Direct Upload to Azure
      const azureRes = await profileService.uploadToAzure(sasUrl, file);

      if (azureRes.ok) {
        // Step 3: Confirm with Backend
        const confirmRes = await profileService.confirmUpload('bar', token, blobName);
        
        // Update local state with the permanent URL returned by the backend
        const finalUrl = confirmRes.profile?.profileImage || confirmRes.imageUrl;
        setFormData(prev => ({ ...prev, profileImage: finalUrl }));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleFinalSave = async () => {
    const stored = localStorage.getItem('auth-storage');
    const token = stored ? JSON.parse(stored).state?.token : '';
    
    try {
      await profileService.updateProfile('bar', token, formData);
      onSaveSuccess();
      onClose();
    } catch (err) {
      alert("Failed to save changes.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-4xl w-full max-w-xl p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
        <h2 className="text-2xl font-bold mb-8 text-center">Update Bar Profile</h2>

        {/* Image Upload Section */}
        <div className="flex flex-col items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <div className="w-28 h-28 rounded-full bg-gray-50 overflow-hidden border-2 border-gray-100 relative shadow-sm">
            {formData.profileImage ? (
              <img src={formData.profileImage} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">NA</div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            disabled={uploading}
          >
            {uploading ? "Uploading to Cloud..." : "Change Profile Photo"}
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Business Name" value={formData.businessName} onChange={(v: any) => setFormData({...formData, businessName: v})} />
          <InputField label="Owner Name" value={formData.ownerName} onChange={(v: any) => setFormData({...formData, ownerName: v})} />
          <InputField label="Venue Type" value={formData.venueType} onChange={(v: any) => setFormData({...formData, venueType: v})} />
          <InputField label="Phone" value={formData.phone} onChange={(v: any) => setFormData({...formData, phone: v})} />
          <div className="col-span-2">
            <InputField label="Address" value={formData.address} onChange={(v: any) => setFormData({...formData, address: v})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl mt-1 text-sm h-32 outline-none focus:ring-2 focus:ring-black/5"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors">CANCEL</button>
          <button onClick={handleFinalSave} className="flex-1 bg-black text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">
            SAVE UPDATES
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 font-medium text-sm outline-none focus:ring-2 focus:ring-black/5"
    />
  </div>
);