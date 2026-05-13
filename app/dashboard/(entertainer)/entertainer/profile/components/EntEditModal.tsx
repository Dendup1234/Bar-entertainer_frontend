"use client";
import React, { useState, useRef } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { profileService } from '@/features/profile/services/profileservices';

export const EntEditModal = ({ isOpen, onClose, user, onSaveSuccess }: any) => {
  const [form, setForm] = useState({
    stageName:          user?.stageName          || '',
    name:               user?.name               || '',
    phone:              user?.phone              || '',
    entertainerType:    user?.entertainerType    || '',
    location:           user?.location           || '',
    experiences:        user?.experiences        || '',
    availableAt:        user?.availableAt        || '',
    availabilityStatus: user?.availabilityStatus || 'available',
    performanceFeeMin:  user?.performanceFeeMin  || 0,
    performanceFeeMax:  user?.performanceFeeMax  || 0,
    genres:             user?.genres?.join(', ') || '',
    instagram:          user?.socialLinks?.instagram || '',
    youtube:            user?.socialLinks?.youtube   || '',
    profileImage:       user?.profileImage       || '',
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
      const { sasUrl, blobName } = await profileService.getSasUrl('entertainer', token, file);
      const azureRes = await profileService.uploadToAzure(sasUrl, file);
      if (azureRes.ok) {
        const confirmRes = await profileService.confirmUpload('entertainer', token, blobName);
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
      const payload = {
        stageName:          form.stageName,
        name:               form.name,
        phone:              form.phone,
        entertainerType:    form.entertainerType,
        location:           form.location,
        experiences:        form.experiences,
        availableAt:        form.availableAt,
        availabilityStatus: form.availabilityStatus,
        performanceFeeMin:  Number(form.performanceFeeMin),
        performanceFeeMax:  Number(form.performanceFeeMax),
        genres:             form.genres.split(',').map((s: string) => s.trim()).filter(Boolean),
        socialLinks: {
          instagram: form.instagram,
          youtube:   form.youtube,
        },
        profileImage: form.profileImage,
      };
      await profileService.updateProfile('entertainer', token, payload);
      onSaveSuccess();
      onClose();
    } catch (err) {
      alert('Failed to save profile.');
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
              Update your entertainer profile
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Profile Image */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              overflow: 'hidden', border: '2px solid #e5e7eb',
              backgroundColor: '#f3f4f6', position: 'relative',
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
              style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            >
              {uploading ? 'Uploading...' : 'Change photo'}
            </button>
          </div>

          {/* Stage Name + Real Name */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Stage Name</label>
              <input value={form.stageName} onChange={e => set('stageName', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Real Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Phone + Entertainer Type */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Entertainer Type</label>
              <select
                value={form.entertainerType}
                onChange={e => set('entertainerType', e.target.value)}
                style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Select type</option>
                <option value="dj">DJ</option>
                <option value="band">Live Band</option>
                <option value="singer">Singer</option>
                <option value="comedian">Comedian</option>
              </select>
            </div>
          </div>

          {/* Location + Availability Status */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Thimphu" style={inp} />
            </div>
            <div>
              <label style={lbl}>Availability Status</label>
              <select
                value={form.availabilityStatus}
                onChange={e => set('availabilityStatus', e.target.value)}
                style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>

          {/* Fee Min + Fee Max */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Min Fee (Nu.)</label>
              <input type="number" value={form.performanceFeeMin} onChange={e => set('performanceFeeMin', e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Max Fee (Nu.)</label>
              <input type="number" value={form.performanceFeeMax} onChange={e => set('performanceFeeMax', e.target.value)} style={inp} />
            </div>
          </div>

          {/* Genres */}
          <div>
            <label style={lbl}>Genres</label>
            <input value={form.genres} onChange={e => set('genres', e.target.value)} placeholder="e.g. EDM, Hip Hop (comma separated)" style={inp} />
          </div>

          {/* Available At */}
          <div>
            <label style={lbl}>Available At</label>
            <input value={form.availableAt} onChange={e => set('availableAt', e.target.value)} placeholder="e.g. Weekends and evenings" style={inp} />
          </div>

          {/* Experience */}
          <div>
            <label style={lbl}>Experience</label>
            <textarea
              rows={3} value={form.experiences}
              onChange={e => set('experiences', e.target.value)}
              placeholder="e.g. 5 years performing in clubs and events"
              style={{ ...inp, resize: 'none', lineHeight: '1.6' }}
            />
          </div>

          {/* Social Links */}
          <div style={grid2}>
            <div>
              <label style={lbl}>Instagram</label>
              <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/..." style={inp} />
            </div>
            <div>
              <label style={lbl}>YouTube</label>
              <input value={form.youtube} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/..." style={inp} />
            </div>
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