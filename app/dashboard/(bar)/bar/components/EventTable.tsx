import React, { useEffect, useState } from 'react';
import { EventDetailModal } from './EventDetailModal';
import { QRModal } from './QRModal'; 
import { barService } from '@/features/home/services/barServices';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
};

const formatTime = (start: string, end: string) => {
  if (!start || !end) return '—';
  const fmt = (t: string) => {
    if (/^\d{2}:\d{2}/.test(t)) return t.slice(0, 5);

    const date = new Date(t);
    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return `${fmt(start)} – ${fmt(end)}`;
};

interface Props {
  events: any[];
  searchTerm: string;
  eventTypeFilter?: 'All' | 'Public' | 'Private';
  onEdit?: (event: any) => void;
  onDeactivate?: (eventId: string) => void;
  onRefresh?: () => void;
}

export const EventTable = ({ events, searchTerm, eventTypeFilter = 'All', onRefresh }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const [generatedQrEvents, setGeneratedQrEvents] = useState<Record<string, boolean>>({});
  
  // QR Modal States
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState<{
    reviewUrl: string;
    token: string;
    eventName: string;
    validFrom?: string;
    validUntil?: string;
    mode: 'generated' | 'regenerated';
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bar-review-qr-events');
      if (stored) setGeneratedQrEvents(JSON.parse(stored));
    } catch {
      setGeneratedQrEvents({});
    }
  }, []);

  const markQrGenerated = (eventId: string) => {
    setGeneratedQrEvents((current) => {
      const next = { ...current, [eventId]: true };
      localStorage.setItem('bar-review-qr-events', JSON.stringify(next));
      return next;
    });
  };

  const filtered = events.filter((e) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = [
      e.title,
      e.city,
      e.venueAddress,
      e.status,
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const eventType = e.isPublic ? 'Public' : 'Private';
    const matchesType = eventTypeFilter === 'All' || eventType === eventTypeFilter;

    return matchesSearch && matchesType;
  });

  // Logic to view event details
  const handleRowClick = async (e: any) => {
    setLoadingEventId(e._id);
    try {
      const full = await barService.getEventById(e._id);
      const event = full.events?.[0] || full.event || full;
      setSelectedEvent(event);
    } catch (err) {
      console.error('Failed to load event:', err);
      setSelectedEvent(e);
    } finally {
      setLoadingEventId(null);
    }
  };

  // Logic to generate/regenerate the unique QR Token and open modal
  const handleGenerateQR = async (e: any) => {
    setLoadingEventId(e._id);
    try {
      const shouldRegenerate = !!generatedQrEvents[e._id];
      const response = shouldRegenerate
        ? await barService.regenerateReviewToken(e._id)
        : await barService.generateReviewToken(e._id);
      
      if (response && response.reviewUrl) {
        markQrGenerated(e._id);
        setQrData({
          reviewUrl: response.reviewUrl,
          token: response.token,
          eventName: e.title || 'Event',
          validFrom: response.validFrom,
          validUntil: response.validUntil,
          mode: shouldRegenerate ? 'regenerated' : 'generated',
        });
        setIsQrModalOpen(true);
      }
    } catch (err) {
      console.error('QR Generation failed:', err);
      alert('Could not generate QR code. Ensure an entertainer is booked for this event.');
    } finally {
      setLoadingEventId(null);
    }
  };

  const headers = [
    'ID', 'DATE', 'EVENT NAME', 'EVENT TYPE', 
    'TIME / OFFERED', 'ENTERTAINER', 'LOCATION', 'ACTION'
  ];

  return (
    <>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} style={{
                  padding: '20px 16px', textAlign: 'left',
                  fontSize: '11px', fontWeight: 500, color: '#9ca3af',
                  letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  borderBottom: '1px solid #f3f4f6',
                  textTransform: 'uppercase'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((e, i) => (
              <tr
                key={e._id}
                onClick={() => handleRowClick(e)}
                style={{
                  borderBottom: '1px solid #f9fafb',
                  cursor: loadingEventId === e._id ? 'wait' : 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={ev => (ev.currentTarget.style.backgroundColor = '#fafafa')}
                onMouseLeave={ev => (ev.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* ID */}
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#111827' }}>
                  {String(i + 1).padStart(2, '0')}
                </td>

                {/* Date */}
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#4b5563' }}>
                  {formatDate(e.eventDate)}
                </td>

                {/* Event Name */}
                <td style={{ padding: '24px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                  {e.title || '—'}
                </td>

                {/* Event Type */}
                <td style={{ padding: '24px 16px' }}>
                  <span style={{
                    display: 'inline-flex', padding: '6px 16px', borderRadius: '99px',
                    fontSize: '12px', fontWeight: 500,
                    backgroundColor: e.isPublic ? '#d1d5db' : '#e5e7eb',
                    color: '#111827', minWidth: '70px', justifyContent: 'center'
                  }}>
                    {e.isPublic ? 'Public' : 'Private'}
                  </span>
                </td>

                {/* Time & Offered Amount Merged (as requested) */}
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#4b5563' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>{formatTime(e.startTime, e.endTime)}</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                       {e.offeredAmount ? `Nu. ${e.offeredAmount.toLocaleString()}` : ''}
                    </span>
                  </div>
                </td>

                {/* Entertainer */}
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#4b5563' }}>
                  {e.entertainerTypeNeeded?.join(', ') || '—'}
                </td>

                {/* Location */}
                <td style={{ padding: '24px 16px', fontSize: '13px', color: '#4b5563' }}>
                  {e.city || '—'}
                </td>

                {/* Action Column */}
                <td 
                  style={{ padding: '24px 16px' }}
                  onClick={(ev) => ev.stopPropagation()}
                >
                  <button
                    onClick={() => handleGenerateQR(e)}
                    disabled={loadingEventId === e._id}
                    style={{
                      fontSize: '13px', color: '#111827', fontWeight: 500,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px',
                      opacity: loadingEventId === e._id ? 0.5 : 1
                    }}
                  >
                    {loadingEventId === e._id
                      ? 'Processing...'
                      : generatedQrEvents[e._id]
                        ? 'Regenerate QR code'
                        : 'Generate QR code'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
            No events found
          </div>
        )}
      </div>

      {/* QR Modal for displaying the unique code */}
      <QRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        data={qrData}
        eventName={qrData?.eventName || ''}
      />

      {/* Detail Modal */}
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
