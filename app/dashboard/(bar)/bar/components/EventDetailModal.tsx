import React, { useState } from 'react';
import { X, MapPin, User, Music2, Clock, Calendar, Pencil, DollarSign, Tag } from 'lucide-react';
import { EventForm } from './EventForm';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    event: any;
    onRefresh: () => void;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f9fafb' }}>
        <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#f9fafb', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
            <span style={{ color: '#9ca3af' }}>{icon}</span>
        </div>
        <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {label}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                {value || '—'}
            </p>
        </div>
    </div>
);

const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (t: string) => {
    if (!t) return '—';
    return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const statusColor = (s: string) => {
    switch (s?.toLowerCase()) {
        case 'completed': return { bg: '#f0fdf4', color: '#16a34a' };
        case 'canceled': return { bg: '#fef2f2', color: '#dc2626' };
        case 'in progress': return { bg: '#eff6ff', color: '#2563eb' };
        default: return { bg: '#f9fafb', color: '#6b7280' };
    }
};

export const EventDetailModal = ({ isOpen, onClose, event, onRefresh }: Props) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!isOpen || !event) return null;

    if (isEditing) {
        return (
            <EventForm
                initialData={event}
                onSuccess={() => { setIsEditing(false); onRefresh(); onClose(); }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    const sc = statusColor(event.status);

    const imageSrc = event.coverImage || event.bannerImageUrl || event.image || event.banner || '';

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
        }}>
            <div style={{
                width: '100%', maxWidth: '480px', maxHeight: '90vh',
                backgroundColor: '#fff', borderRadius: '20px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>

                {/* Cover Image */}
                <div style={{
                    width: '100%', height: '180px', position: 'relative',
                    backgroundColor: '#111827', flexShrink: 0,
                }}>
                    {imageSrc
                        ? <img src={imageSrc} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (
                            <div style={{
                                width: '100%', height: '100%',
                                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <p style={{
                                    color: 'rgba(255,255,255,0.15)', fontSize: '42px',
                                    fontWeight: 800, letterSpacing: '0.05em', textAlign: 'center',
                                    padding: '0 20px', lineHeight: 1.2,
                                }}>
                                    {event.title?.toUpperCase()}
                                </p>
                            </div>
                        )
                    }


                    {/* Overlay top bar */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px',
                    }}>
                        {/* Status badge */}
                        <span style={{
                            padding: '4px 12px', borderRadius: '9999px',
                            fontSize: '11px', fontWeight: 600,
                            backgroundColor: sc.bg, color: sc.color,
                        }}>
                            {(event.status || 'open').charAt(0).toUpperCase() + (event.status || 'open').slice(1)}
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setIsEditing(true)} style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '6px 14px', borderRadius: '9999px',
                                fontSize: '12px', fontWeight: 600,
                                backgroundColor: 'rgba(255,255,255,0.95)', color: '#111827',
                                border: 'none', cursor: 'pointer',
                            }}>
                                <Pencil size={11} /> Edit
                            </button>
                            <button onClick={onClose} style={{
                                width: '30px', height: '30px', borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.95)', border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#374151',
                            }}>
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Title overlay at bottom */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '32px 20px 16px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }}>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                            {event.title}
                        </h2>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <span style={{
                                padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                                backgroundColor: event.isPublic ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                                color: '#fff', backdropFilter: 'blur(4px)',
                            }}>
                                {event.isPublic ? 'Public' : 'Private'}
                            </span>
                            {event.reviewCount > 0 && (
                                <span style={{
                                    padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                                    backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff',
                                }}>
                                    {event.reviewCount} reviews
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 8px' }}>

                    <InfoRow icon={<Calendar size={14} />} label="Date" value={formatDate(event.eventDate)} />
                    <InfoRow icon={<Clock size={14} />} label="Time" value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`} />
                    <InfoRow icon={<MapPin size={14} />} label="Location" value={[event.city, event.venueAddress].filter(Boolean).join(', ')} />
                    <InfoRow icon={<DollarSign size={14} />} label="Offered Amount" value={event.offeredAmount ? `Nu. ${event.offeredAmount.toLocaleString()}` : '—'} />
                    <InfoRow icon={<User size={14} />} label="Entertainer Type" value={(event.entertainerTypeNeeded || []).join(', ')} />
                    <InfoRow icon={<Music2 size={14} />} label="Preferred Genres" value={(event.genresPreferred || []).join(', ')} />
                    <InfoRow icon={<User size={14} />} label="Selected Entertainer" value={event.selectedEntertainer?.name || 'Not yet selected'} />

                    {event.description && (
                        <div style={{ padding: '14px 0' }}>
                            <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                Description
                            </p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.7' }}>
                                {event.description}
                            </p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
                    <button onClick={onClose} style={{
                        width: '100%', padding: '11px', borderRadius: '12px',
                        fontSize: '13px', fontWeight: 500, color: '#6b7280',
                        backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', cursor: 'pointer',
                    }}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};
