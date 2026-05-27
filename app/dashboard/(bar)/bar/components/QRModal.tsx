import React, { useRef } from 'react';
import { Download, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    reviewUrl: string;
    token: string;
    validFrom?: string;
    validUntil?: string;
    mode?: 'generated' | 'regenerated';
  } | null;
  eventName: string;
}

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const toFileName = (value: string) => {
  const safe = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${safe || 'event'}-review-qr.png`;
};

export const QRModal = ({ isOpen, onClose, data, eventName }: QRModalProps) => {
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen || !data) return null;

  const handleDownload = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = toFileName(eventName);
    link.click();
  };

  const statusText = data.mode === 'regenerated'
    ? 'New review QR token regenerated'
    : 'Review QR token generated';

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: '#fff', borderRadius: '20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #f3f4f6',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {statusText}
            </p>
            <h3 style={{ margin: '5px 0 0', fontSize: '17px', fontWeight: 700, color: '#111827' }}>
              {eventName || 'Event'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR modal"
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              border: '1px solid #e5e7eb', backgroundColor: '#fff',
              color: '#6b7280', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div style={{ padding: '24px 24px 22px', textAlign: 'center' }}>
          <div style={{
            width: '240px', height: '240px',
            margin: '0 auto', padding: '18px',
            border: '1px solid #e5e7eb', borderRadius: '18px',
            backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <QRCodeCanvas
              ref={qrRef}
              value={data.reviewUrl}
              size={200}
              level="H"
              includeMargin
            />
          </div>

          <div style={{
            marginTop: '18px', border: '1px solid #f3f4f6',
            borderRadius: '12px', overflow: 'hidden', textAlign: 'left',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: '8px', padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Token</span>
              <span style={{ fontSize: '11px', color: '#111827', wordBreak: 'break-all' }}>{data.token}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: '8px', padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Valid from</span>
              <span style={{ fontSize: '11px', color: '#111827' }}>{formatDateTime(data.validFrom)}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '92px 1fr', gap: '8px', padding: '10px 12px' }}>
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Valid until</span>
              <span style={{ fontSize: '11px', color: '#111827' }}>{formatDateTime(data.validUntil)}</span>
            </div>
          </div>

          <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#9ca3af', wordBreak: 'break-all', lineHeight: 1.5 }}>
            {data.reviewUrl}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '22px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#f9fafb', color: '#6b7280',
                borderRadius: '12px', border: '1px solid #e5e7eb',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#111827', color: '#fff',
                borderRadius: '12px', border: '1px solid #111827',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
