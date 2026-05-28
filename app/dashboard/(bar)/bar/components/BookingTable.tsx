import React from 'react';

interface Props {
  bookings: any[];
  searchTerm: string;
  statusFilter?: 'All' | 'Pending' | 'Accepted' | 'Rejected';
  onView?: (booking: any) => void;
}

const statusStyle = (status: string): React.CSSProperties => {
  switch (status?.toLowerCase()) {
    case 'accepted': return { color: '#16a34a', fontWeight: 500 };
    case 'rejected': return { color: '#dc2626', fontWeight: 500 };
    case 'pending':  return { color: '#d97706', fontWeight: 500 };
    default:         return { color: '#6b7280', fontWeight: 500 };
  }
};

const headers = ['ID', 'ENTERTAINER', 'TYPE', 'EVENT NAME', 'EVENT TYPE', 'OFFERED AMOUNT', 'STATUS'];

export const BookingTable = ({ bookings, searchTerm, statusFilter = 'All', onView }: Props) => {
  const filtered = bookings.filter((b) => {
    const entertainerName = b.entertainer?.stageName || b.entertainer?.name || '';
    const eventName = b.event?.title || '';
    const q = searchTerm.toLowerCase();
    const matchesSearch = entertainerName.toLowerCase().includes(q) || eventName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || b.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '64px 16px', textAlign: 'center', fontSize: '12px', color: '#d1d5db' }}>
                No bookings found
              </td>
            </tr>
          ) : (
            filtered.map((b, i) => (
              <tr
                key={b._id || i}
                onClick={() => onView?.(b)}
                style={{ borderBottom: '1px solid #f9fafb', cursor: onView ? 'pointer' : 'default' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* ID */}
                <td style={{ padding: '20px 16px', fontSize: '11px', color: '#c0c8d4', fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </td>

                {/* Entertainer name */}
                <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                  {b.entertainer?.stageName || b.entertainer?.name || '—'}
                </td>

                {/* Entertainer type */}
                <td style={{ padding: '20px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '5px 14px', borderRadius: '9999px',
                    fontSize: '12px', backgroundColor: '#f3f4f6', color: '#374151',
                    textTransform: 'capitalize',
                  }}>
                    {b.entertainer?.entertainerType ||
                     b.entertainer?.bio?.entertainerType ||
                     b.entertainerType ||
                     '—'}
                  </span>
                </td>

                {/* Event name */}
                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#374151' }}>
                  {b.event?.title || '—'}
                </td>

                {/* Event type public/private */}
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

                {/* Agreed amount */}
                <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                  {b.agreedAmount ? `Nu. ${Number(b.agreedAmount).toLocaleString()}` : '—'}
                </td>

                {/* Status */}
                <td style={{ padding: '20px 16px', fontSize: '13px', ...statusStyle(b.status) }}>
                  {b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
