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
      setEvents(list.filter((e: any) => e.status === 'open'));
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        backgroundColor: '#fff', borderRadius: '20px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
              Book Entertainer
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              Select an event to book {entertainer?.stageName || entertainer?.name}
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

        {/* Entertainer preview */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 24px', backgroundColor: '#f9fafb',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            overflow: 'hidden', flexShrink: 0,
            backgroundColor: '#e5e7eb',
          }}>
            {entertainer?.profileImage
              ? <img src={entertainer.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', backgroundColor: '#d1d5db' }} />
            }
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              {entertainer?.stageName || entertainer?.name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>
              {entertainer?.bio?.entertainerType || entertainer?.entertainerType || '—'} · Nu. {entertainer?.bio?.priceRange || `${entertainer?.performanceFeeMin?.toLocaleString()} – ${entertainer?.performanceFeeMax?.toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Event selector */}
        <div style={{ padding: '20px 24px' }}>
          <label style={{
            fontSize: '11px', fontWeight: 600, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '0.07em',
            display: 'block', marginBottom: '10px',
          }}>
            Select Event
          </label>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '13px' }}>
              <Loader2 size={14} className="animate-spin" /> Loading your events...
            </div>
          ) : events.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
              No open events found. Create an event first.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {events.map(ev => (
                <div
                  key={ev._id}
                  onClick={() => setSelectedEventId(ev._id)}
                  style={{
                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: selectedEventId === ev._id ? '1.5px solid #111827' : '1px solid #e5e7eb',
                    backgroundColor: selectedEventId === ev._id ? '#f9fafb' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.1s',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      {ev.title}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                      {ev.city} · Nu. {ev.offeredAmount?.toLocaleString()}
                    </p>
                  </div>
                  {selectedEventId === ev._id && (
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      backgroundColor: '#111827', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Check size={11} color="#fff" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px',
          padding: '12px 24px 20px', borderTop: '1px solid #f3f4f6',
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 500, color: '#6b7280',
            backgroundColor: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || !selectedEventId}
            style={{
              flex: 2, padding: '11px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 600, color: '#fff',
              backgroundColor: !selectedEventId ? '#9ca3af' : '#111827',
              border: 'none',
              cursor: submitting || !selectedEventId ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? <><Loader2 size={13} className="animate-spin" /> Booking...</> : <><Check size={13} /> Confirm Booking</>}
          </button>
        </div>

      </div>
    </div>
  );
};