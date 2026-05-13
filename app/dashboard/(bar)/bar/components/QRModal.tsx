import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    reviewUrl: string;
    token: string;
  } | null;
  eventName: string;
}

export const QRModal = ({ isOpen, onClose, data, eventName }: QRModalProps) => {
  if (!isOpen || !data) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '32px', borderRadius: '16px',
        width: '100%', maxWidth: '400px', textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Event QR Code</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>{eventName}</p>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '12px', display: 'inline-block' }}>
          <QRCodeSVG value={data.reviewUrl} size={200} />
        </div>

        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', wordBreak: 'break-all' }}>
          {data.reviewUrl}
        </p>

        <button 
          onClick={onClose}
          style={{
            marginTop: '24px', width: '100%', padding: '12px',
            backgroundColor: '#111827', color: '#fff', borderRadius: '8px',
            border: 'none', cursor: 'pointer', fontWeight: 500
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};