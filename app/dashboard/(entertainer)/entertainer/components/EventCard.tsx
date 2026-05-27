import React from 'react';
import { Calendar, Music2, Clock, MapPin, DollarSign, Users } from 'lucide-react';

interface Props {
  _id: string;
  title: string;
  description?: string;
  bannerImageUrl?: string;
  venueAddress?: string; 
  city?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  genresPreferred?: string[];
  entertainerTypeNeeded?: string[]; 
  offeredAmount?: number;
  onOpen?: () => void;
  onApply?: () => void;
}

const formatDate = (d: string) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
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

export const EventCard = ({
  title, bannerImageUrl, venueAddress, city,
  eventDate, startTime, endTime, genresPreferred,
  entertainerTypeNeeded, offeredAmount, onOpen, onApply,
}: Props) => {
  const displayTitle = title || 'Untitled Event';

  const Row = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <span style={{ color: '#9ca3af', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: '12px', color: '#374151' }}>{text}</span>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '16px',
      border: '1px solid #e5e7eb', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
    }}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen?.();
        }
      }}
    >
      {/* Banner */}
      <div style={{ width: '100%', height: '140px', backgroundColor: '#111827', position: 'relative' }}>
        {bannerImageUrl 
          ? <img src={bannerImageUrl} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ 
              width: '100%', height: '100%', 
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>{displayTitle.substring(0, 2).toUpperCase()}</p>
            </div>
        }
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 700 }}>{displayTitle}</h3>

        <div style={{ flex: 1 }}>
          <Row icon={<MapPin size={13} />} text={venueAddress || city || 'Location TBD'} />
          <Row icon={<Calendar size={13} />} text={formatDate(eventDate)} />
          <Row icon={<Clock size={13} />} text={formatTime(startTime, endTime)} />
          <Row icon={<Users size={13} />} text={entertainerTypeNeeded?.join(', ') || 'Any'} />
          <Row icon={<Music2 size={13} />} text={genresPreferred?.join(', ') || 'All Genres'} />
          <Row icon={<DollarSign size={13} />} text={offeredAmount ? `Nu. ${offeredAmount.toLocaleString()}` : 'Negotiable'} />
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onApply?.();
          }}
          style={{
            marginTop: '14px', width: '100%', padding: '10px',
            backgroundColor: '#111827', color: '#fff',
            border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};
