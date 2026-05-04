import React, { useState } from 'react';
import { EventDetailModal } from './EventDetailModal';
import { barService } from '@/features/home/services/barServices';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
};

const formatTime = (start: string, end: string) => {
  if (!start || !end) return '—';
  const fmt = (t: string) =>
    new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${fmt(start)} – ${fmt(end)}`;
};

interface Props {
  events: any[];
  searchTerm: string;
  onEdit?: (event: any) => void;
  onDeactivate?: (eventId: string) => void;
  onRefresh?: () => void;
}

export const EventTable = ({ events, searchTerm, onEdit, onRefresh }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  const filtered = events.filter((e) =>
    (e.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );


  // ONLY CHANGE IS INSIDE handleRowClick

  const handleRowClick = async (e: any) => {
    setLoadingEventId(e._id);
    try {
      const full = await barService.getEventById(e._id);
      console.log('FULL EVENT DATA:', full);
      // Response is { events: [...] } based on your Postman
      const event = full.events?.[0] || full.event || full;
      setSelectedEvent(event);
    } catch (err) {
      console.error('Failed to load event:', err);
      setSelectedEvent(e);
    } finally {
      setLoadingEventId(null);
    }
  };

  const headers = [
    'ID',
    'DATE',
    'EVENT NAME',
    'EVENT TYPE',
    'TIME',
    'ENTERTAINER',
    'OFFERED AMOUNT',
    'STATUS',
    'ACTION'
  ];

  return (
    <>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>

          {/* HEADER */}
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#c0c8d4',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filtered.map((e, i) => (
              <tr
                key={e._id}
                onClick={() => handleRowClick(e)}
                style={{
                  borderBottom: '1px solid #f9fafb',
                  cursor: loadingEventId === e._id ? 'wait' : 'pointer',
                  opacity: loadingEventId === e._id ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <td style={{ padding: '20px 16px', fontSize: '11px', color: '#c0c8d4', fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </td>

                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatDate(e.eventDate)}
                </td>

                <td style={{ padding: '20px 16px', fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                  {e.title}
                </td>

                <td style={{ padding: '20px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 400,
                      backgroundColor: e.isPublic ? '#1f2937' : '#f3f4f6',
                      color: e.isPublic ? '#fff' : '#6b7280',
                    }}
                  >
                    {e.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>

                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {formatTime(e.startTime, e.endTime)}
                </td>

                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280' }}>
                  {e.selectedEntertainer?.name || '—'}
                </td>

                <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                  {e.offeredAmount ? `Nu. ${e.offeredAmount.toLocaleString()}` : '—'}
                </td>

                <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280' }}>
                  {(e.status || '').toLowerCase()}
                </td>

                {/* ACTIONS */}
                <td
                  style={{ padding: '20px 16px' }}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                    <button
                      onClick={() => handleRowClick(e)}
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontWeight: 500,
                      }}
                    >
                      {loadingEventId === e._id ? 'Loading...' : 'View'}
                    </button>

                    <button
                      onClick={() => onEdit?.(e)}
                      style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Generate QR
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '12px', color: '#d1d5db' }}>No events found</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <EventDetailModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onRefresh={() => {
          onRefresh?.();
          setSelectedEvent(null);
        }}
      />
    </>
  );
};