import React from 'react';

interface Props {
  label: string;
  value: number;
}

export const BookingStatCard = ({ label, value }: Props) => (
  <div style={{
    width: '160px', height: '160px', backgroundColor: '#fff',
    border: '1px solid #e5e7eb', borderRadius: '24px',
    padding: '20px', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', flexShrink: 0,
  }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <span style={{ fontSize: '44px', fontWeight: 300, color: '#111827', lineHeight: 1 }}>
        {value}
      </span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{ fontSize: '14px', fontWeight: 400, color: '#9ca3af' }}>
        {label}
      </span>
    </div>
  </div>
);