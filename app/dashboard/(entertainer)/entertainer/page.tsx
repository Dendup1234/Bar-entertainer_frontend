"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { SearchBar } from './components/SearchBar';
import { entertainerServices  } from '@/features/home/services/entertainerServices';
import { FilterButton, dashboardToolbarStyle } from '@/components/dashboard/DashboardControls';

export default function EntertainerDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await entertainerServices .getEvents();
      const nextEvents = Array.isArray(data?.events)
        ? data.events
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setEvents(nextEvents);
    } catch (err) {
      console.error("Failed to load events", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (eventId: string) => {
    try {
      await entertainerServices.applyForEvent(eventId);
      alert('Application sent!');
    } catch (err) {
      alert('Application failed.');
    }
  };

  const normalizeEventDetail = (data: any) => {
    if (Array.isArray(data?.events)) return data.events[0] || null;
    if (Array.isArray(data?.data)) return data.data[0] || null;
    return data?.event || data?.data || data || null;
  };

  const handleOpenEvent = async (evt: any) => {
    setSelectedEvent(evt);
    setIsDetailOpen(true);
    setIsDetailLoading(true);

    try {
      const data = await entertainerServices.getEventById(evt._id);
      setSelectedEvent(normalizeEventDetail(data) || evt);
    } catch (err) {
      console.error('Failed to load event details', err);
      alert('Failed to load event details.');
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = events.filter((e: any) => {
    const title = String(e?.title || '').toLowerCase();
    const venueAddress = String(e?.venueAddress || '').toLowerCase();
    const city = String(e?.city || '').toLowerCase();
    const eventType = e?.isPublic ? 'Public' : 'Private';
    const matchesType = eventTypeFilter === 'All' || eventType === eventTypeFilter;

    return matchesType && (title.includes(query) || venueAddress.includes(query) || city.includes(query));
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={dashboardToolbarStyle}>
          <SearchBar
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for events"
          />
          <FilterButton
            label={eventTypeFilter === 'All' ? 'Filter' : eventTypeFilter}
            onClick={() => setEventTypeFilter((current) => current === 'All' ? 'Public' : current === 'Public' ? 'Private' : 'All')}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={32} color="#111827" />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {filtered.map((evt: any) => {
              const eventId = evt._id || evt.id;

              return (
                <EventCard
                  key={eventId}
                  _id={eventId}
                  title={evt.title || 'Untitled Event'}
                  bannerImageUrl={evt.bannerImageUrl || evt.coverImage || evt.image}
                  venueAddress={evt.venueAddress}
                  city={evt.city}
                  eventDate={evt.eventDate}
                  startTime={evt.startTime}
                  endTime={evt.endTime}
                  genresPreferred={Array.isArray(evt.genresPreferred) ? evt.genresPreferred : []}
                  entertainerTypeNeeded={Array.isArray(evt.entertainerTypeNeeded) ? evt.entertainerTypeNeeded : []}
                  offeredAmount={evt.offeredAmount}
                  onOpen={() => eventId && handleOpenEvent({ ...evt, _id: eventId })}
                  onApply={() => eventId && handleApply(eventId)}
                />
              );
            })}
          </div>
        )}

        <EventDetailModal
          isOpen={isDetailOpen}
          event={selectedEvent}
          isLoading={isDetailLoading}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedEvent(null);
          }}
          onApply={() => selectedEvent?._id && handleApply(selectedEvent._id)}
        />
      </div>
    </div>
  );
}
