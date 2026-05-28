import React, { useState } from 'react';
import { entertainerServices } from '@/features/home/services/entertainerServices';
interface Props {
  bookings: any[];
  searchTerm: string;
  statusFilter?: 'All' | 'Pending' | 'Accepted' | 'Rejected';
  onRefresh: () => void;
}

const statusStyle = (status: string): React.CSSProperties => {
  switch (status?.toLowerCase()) {
    case 'accepted': return { color: '#16a34a', fontWeight: 500 };
    case 'rejected': return { color: '#dc2626', fontWeight: 500 };
    case 'pending': return { color: '#d97706', fontWeight: 500 };
    default: return { color: '#6b7280', fontWeight: 500 };
  }
};

const headers = ['ID', 'EVENT NAME', 'EVENT TYPE', 'AGREED AMOUNT', 'STATUS', 'ACTION'];

export const EntertainerBookingTable = ({ bookings, searchTerm, statusFilter = 'All', onRefresh }: Props) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = bookings.filter((b) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = [
      b.event?.title,
      b.event?.city,
      b.event?.venueAddress,
      b.status,
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'All' || b.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatus = async (bookingId: string, status: 'accepted' | 'rejected') => {
    setLoadingId(bookingId + status);
    try {
      await entertainerServices.updateBookingStatus(bookingId, status);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    } finally {
      setLoadingId(null);
    }
  };

  const ActionBtn = ({ bookingId, status, label }: { bookingId: string; status: 'accepted' | 'rejected'; label: string }) => {
    const isLoading = loadingId === bookingId + status;
    const isAccept = status === 'accepted';
    return (
      <button
        onClick={() => handleStatus(bookingId, status)}
        disabled={!!loadingId}
        style={{
          fontSize: '12px', fontWeight: 500,
          color: isAccept ? '#111827' : '#dc2626',
          textDecoration: loadingId ? 'none' : 'underline',
          textUnderlineOffset: '2px',
          background: 'none', border: 'none',
          cursor: loadingId ? 'not-allowed' : 'pointer',
          padding: 0, opacity: loadingId ? 0.5 : 1,
        }}
      >
        {isLoading ? '...' : label}
      </button>
    );
  };

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'left',
                fontSize: '11px', fontWeight: 400, color: '#c0c8d4',
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
                borderBottom: '1px solid #f3f4f6',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((b, i) => (
            <tr
              key={b._id || i}
              style={{ borderBottom: '1px solid #f9fafb' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '20px 16px', fontSize: '11px', color: '#c0c8d4', fontFamily: 'monospace' }}>
                {String(i + 1).padStart(2, '0')}
              </td>

              <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                {b.event?.title || '—'}
              </td>

              <td style={{ padding: '20px 16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '5px 14px', borderRadius: '9999px',
                  fontSize: '12px',
                  backgroundColor: b.event?.isPublic ? '#1f2937' : '#f3f4f6',
                  color: b.event?.isPublic ? '#fff' : '#6b7280',
                }}>
                  {b.event?.isPublic ? 'Public' : 'Private'}
                </span>
              </td>

              <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                {b.agreedAmount ? `Nu. ${Number(b.agreedAmount).toLocaleString()}` : '—'}
              </td>

              <td style={{ padding: '20px 16px', fontSize: '13px', ...statusStyle(b.status) }}>
                {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : '—'}
              </td>

              <td style={{ padding: '20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {b.status?.toLowerCase() === 'pending' ? (
                    <>
                      <ActionBtn bookingId={b._id} status="accepted" label="Accept" />
                      <ActionBtn bookingId={b._id} status="rejected" label="Reject" />
                    </>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#d1d5db' }}>—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
          <p style={{ fontSize: '12px', color: '#d1d5db' }}>No bookings found</p>
        </div>
      )}
    </div>
  );
};
