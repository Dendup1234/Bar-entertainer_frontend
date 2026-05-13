"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { SearchBar } from './components/SearchBar';
import { entertainerServices  } from '@/features/home/services/entertainerServices';

export default function EntertainerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await entertainerServices .getEvents();
      // Based on your screenshot, the array is inside a property called 'events'
      setEvents(data.events || []); 
    } catch (err) {
      console.error("Failed to load events", err);
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

  const filtered = events.filter((e: any) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.venueAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <SearchBar
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for events"
          />
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 22px', backgroundColor: '#fff',
            border: '1px solid #e5e7eb', borderRadius: '9999px',
            fontSize: '13px', cursor: 'pointer'
          }}>
            <Filter size={15} /> Filter
          </button>
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
            {filtered.map((evt: any) => (
              <EventCard
                key={evt._id}
                _id={evt._id}
                title={evt.title}
                venueAddress={evt.venueAddress}
                city={evt.city}
                eventDate={evt.eventDate}
                startTime={evt.startTime}
                endTime={evt.endTime}
                genresPreferred={evt.genresPreferred}
                offeredAmount={evt.offeredAmount}
                onApply={() => handleApply(evt._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}