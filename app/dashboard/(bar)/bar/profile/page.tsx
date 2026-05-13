"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { profileService } from '@/features/profile/services/profileservices';
import { BarProfileForm } from './components/BarProfileForm';
import { BarEditModal } from './components/BarEditModal';

export default function BarProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    setLoading(true);
    const stored = localStorage.getItem('auth-storage');
    let token = '';
    if (stored) {
      try { token = JSON.parse(stored).state?.token || ''; }
      catch (e) { console.error(e); }
    }
    if (!token) { setLoading(false); return; }
    try {
      const data = await profileService.getProfile('bar', token);
      setProfile(data.profile || data);
    } catch (err) {
      console.error('Failed to fetch bar profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfileData(); }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <Loader2 className="animate-spin" size={32} style={{ color: '#e5e7eb' }} />
    </div>
  );

  return (
    <div style={{ padding: '40px 48px', maxWidth: '900px', margin: '0 auto' }}>
      {profile ? (
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)', overflow: 'hidden',
        }}>
          <BarProfileForm user={profile} onOpenEdit={() => setIsEditOpen(true)} />
          <BarEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            user={profile}
            onSaveSuccess={fetchProfileData}
          />
        </div>
      ) : (
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px',
          border: '1px solid #f3f4f6', padding: '80px 0', textAlign: 'center',
        }}>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>No profile data found.</p>
        </div>
      )}
    </div>
  );
}