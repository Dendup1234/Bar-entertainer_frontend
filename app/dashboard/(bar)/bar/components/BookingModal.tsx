"use client";
import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { barService } from '@/features/home/services/barServices';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entertainer: any;
  onSuccess: () => void;
}

export const BookingModal = ({ isOpen, onClose, entertainer, onSuccess }: Props) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedEventId('');
      loadEvents();
    }
  }, [isOpen]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await barService.getEvents();
      const list = res?.events || [];
      // Only show open events
      const openEvents = list.filter((e: any) => e.status === 'open');
      setEvents(openEvents);
      setSelectedEventId(openEvents[0]?._id || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedEventId) {
      alert('Please select an event.');
      return;
    }
    setSubmitting(true);
    try {
      await barService.createBooking(entertainer._id, selectedEventId);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedEvent = events.find(ev => ev._id === selectedEventId);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px', minHeight: '310px',
          backgroundColor: '#fff', borderRadius: '14px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
          position: 'relative',
          padding: '18px 28px 36px',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close booking confirmation"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '26px', height: '26px', border: 'none',
            background: 'transparent', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#111827',
          }}
        >
          <X size={16} />
        </button>

        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '18px',
        }}>
          <div style={{
            width: '126px', height: '126px',
            border: '6px solid #000',
            borderRadius: '43% 57% 48% 52% / 52% 42% 58% 48%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '2px',
          }}>
            <Check size={78} color="#000" strokeWidth={2.8} />
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', width: '100%',
          }}>
            <span style={{ fontSize: '12px', color: '#111827' }}>Selected Event:</span>
            {loading ? (
              <span style={{
                height: '24px', minWidth: '120px', borderRadius: '9999px',
                backgroundColor: '#d1d5db', color: '#111827',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', fontSize: '10px',
              }}>
                <Loader2 size={11} className="animate-spin" /> Loading
              </span>
            ) : events.length === 0 ? (
              <span style={{
                fontSize: '11px', color: '#9ca3af',
                backgroundColor: '#f3f4f6', borderRadius: '9999px',
                padding: '5px 12px',
              }}>
                No open events
              </span>
            ) : (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                aria-label="Selected event"
                style={{
                  width: '128px', height: '24px', border: 'none',
                  borderRadius: '9999px', backgroundColor: '#d1d5db',
                  color: '#111827', fontSize: '10px',
                  padding: '0 24px 0 16px', outline: 'none',
                  cursor: 'pointer', appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236b7280' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                {events.map(ev => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title || 'Untitled event'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ minHeight: '16px', marginTop: '-8px' }}>
            {selectedEvent && (
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
                {selectedEvent.city || 'Location TBD'} · Nu. {selectedEvent.offeredAmount?.toLocaleString() || 0}
              </p>
            )}
          </div>

          <p style={{
            margin: '0 0 10px', color: '#000', fontSize: '13px',
            fontWeight: 700, textAlign: 'center',
          }}>
            Are you sure you want to book the selected entertainer?
          </p>

          <div style={{
            width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '54px', maxWidth: '318px',
          }}>
            <button
              onClick={handleConfirm}
              disabled={submitting || !selectedEventId}
              style={{
                height: '23px', borderRadius: '3px', border: 'none',
                backgroundColor: !selectedEventId ? '#9ca3af' : '#211f20',
                color: '#fff', fontSize: '11px', fontWeight: 500,
                cursor: submitting || !selectedEventId ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? <><Loader2 size={11} className="animate-spin" /> Booking...</> : 'Yes'}
            </button>
            <button
              onClick={onClose}
              disabled={submitting}
              style={{
                height: '23px', borderRadius: '3px', border: 'none',
                backgroundColor: '#211f20', color: '#fff',
                fontSize: '11px', fontWeight: 500,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              No
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
