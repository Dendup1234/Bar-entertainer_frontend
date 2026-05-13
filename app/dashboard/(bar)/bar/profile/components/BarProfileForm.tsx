"use client";
import React from 'react';

export const BarProfileForm = ({ user, onOpenEdit }: any) => {

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>
        {value || '—'}
      </p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#fff', padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            overflow: 'hidden', border: '2px solid #e5e7eb',
            backgroundColor: '#f3f4f6', flexShrink: 0,
          }}>
            {user?.profileImage
              ? <img src={user.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#9ca3af' }}>NA</div>
            }
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>
              {user?.businessName || 'Bar Name'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#9ca3af' }}>
              {user?.email}
            </p>
          </div>
        </div>
        <button onClick={onOpenEdit} style={{
          padding: '10px 22px', backgroundColor: '#111827', color: '#fff',
          border: 'none', borderRadius: '12px', fontSize: '13px',
          fontWeight: 600, cursor: 'pointer',
        }}>
          Edit Profile
        </button>
      </div>

      {/* Fields */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '24px', borderTop: '1px solid #f3f4f6', paddingTop: '24px',
      }}>
        <Field label="Owner Name"  value={user?.ownerName} />
        <Field label="Phone"       value={user?.phone} />
        <Field label="Venue Type"  value={user?.venueType} />
        <Field label="Address"     value={user?.address} />
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Description" value={user?.description} />
        </div>
      </div>

    </div>
  );
};