"use client";
import React, { useState, useRef } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { profileService } from '@/features/profile/services/profileservices';

export const BarEditModal = ({ isOpen, onClose, user, onSaveSuccess }: any) => {
  const [form, setForm] = useState({
    businessName: user?.businessName || '',
    ownerName:    user?.ownerName    || '',
    phone:        user?.phone        || '',
    venueType:    user?.venueType    || '',
    address:      user?.address      || '',
    description:  user?.description  || '',
    profileImage: user?.profileImage || '',
  });

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const stored = localStorage.getItem('auth-storage');
    const token = stored ? JSON.parse(stored).state?.token : '';
    try {
      const { sasUrl, blobName } = await profileService.getSasUrl('bar', token, file);
      const azureRes = await profileService.uploadToAzure(sasUrl, file);
      if (azureRes.ok) {
        const confirmRes = await profileService.confirmUpload('bar', token, blobName);
        const finalUrl = confirmRes.profile?.profileImage || confirmRes.imageUrl;
        set('profileImage', finalUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const stored = localStorage.getItem('auth-storage');
    const token = stored ? JSON.parse(stored).state?.token : '';
    try {
      await profileService.updateProfile('bar', token, form);
      onSaveSuccess();
      onClose();
    } catch (err) {
      alert('Failed to save changes.');
    }
  };

  if (!isOpen) return null;

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', fontSize: '13px',
    color: '#111827', backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb', borderRadius: '10px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  const lbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '0.07em',
    display: 'block', marginBottom: '6px',
  };

  const grid2: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '520px', maxHeight: '92vh',
        backgroundColor: '#fff', borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
              Edit Profile
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              Update your bar profile
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '30px', height: '30px', borderRadius: '50%',
            border: '1px solid #e5e7eb', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#6b7280',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>

          {/* Profile Image */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              overflow: 'hidden', border: '2px solid #e5e7eb',
              backgroundColor: '#f3f4f6', position: 'relative', flexShrink: 0,
            }}>
              {form.profileImage
                ? <img src={form.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#9ca3af' }}>NA</div>
              }
              {uploading && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Loader2 size={16} className="animate-spin" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                fontSize: '12px', fontWeight: 500, color: '#6b7280',
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: '2px',
              }}
            >
              {uploading ? 'Uploading...' : 'Change photo'}
            </button>
          </div>

          {/* Business Name + Owner Name */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Business Name</label>
              <input value={form.businessName} onChange={e => set('businessName', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Owner Name</label>
              <input value={form.ownerName} onChange={e => set('ownerName', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Venue Type + Phone */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Venue Type</label>
              <input value={form.venueType} onChange={e => set('venueType', e.target.value)} placeholder="e.g. Bar, Club" style={inp} />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={lbl}>Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street / Area" style={inp} />
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea
              rows={4} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Tell entertainers about your venue..."
              style={{ ...inp, resize: 'none', lineHeight: '1.6' }}
            />
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px 20px', borderTop: '1px solid #f3f4f6',
          display: 'flex', gap: '10px', flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 500, color: '#6b7280',
            backgroundColor: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '11px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 600, color: '#fff',
            backgroundColor: '#111827', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Check size={13} strokeWidth={2.5} /> Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};