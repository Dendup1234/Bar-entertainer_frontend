"use client";
import React from 'react';

export const EntProfileForm = ({ user, onOpenEdit }: any) => {
  return (
    <div className="bg-white border-none p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-6">
          {/* Added visual profile image to the read-only view */}
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
             {user?.profileImage ? (
                <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">NA</div>
             )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{user?.stageName || "Artist Name"}</h2>
            <p className="text-gray-500 font-medium">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={onOpenEdit} 
          className="bg-black text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-gray-50 pt-8">
        <DataField label="Real Name" value={user?.realName} />
        <DataField label="Phone" value={user?.phone} />
        <DataField label="Category" value={user?.category} />
        <DataField label="Location" value={user?.address} />
        <div className="col-span-2">
          <DataField label="Artist Bio" value={user?.bio} />
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <p className="text-gray-900 font-semibold mt-1 text-[15px] leading-relaxed">
      {value || "Not provided"}
    </p>
  </div>
);