"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { EventStatCard } from '../components/EventStats';
import { EventTable } from '../components/EventTable';
import { EventForm } from '../components/EventForm';
import { barService } from '@/features/home/services/barServices';

export default function BarEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [counts, setCounts] = useState({ totalCount: 0, publicCount: 0, privateCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => { loadPageData(); }, []);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const [eventsRes, countsRes] = await Promise.all([
        barService.getEvents(),
        barService.getEventCounts(),
      ]);
      if (eventsRes?.events) setEvents(eventsRes.events);
      if (countsRes) {
        setCounts({
          totalCount: countsRes.totalCount || 0,
          publicCount: countsRes.publicCount || 0,
          privateCount: countsRes.privateCount || 0,
        });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px', marginBottom: '48px' }}>
          <EventStatCard label="Total" value={counts.totalCount} />
          <EventStatCard label="Public" value={counts.publicCount} />
          <EventStatCard label="Private" value={counts.privateCount} />
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ position: 'relative', width: '340px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={17} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '44px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
                fontSize: '14px',
                color: '#111827',
                caretColor: '#111827',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '9999px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { setSelectedEvent(null); setIsFormOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '9999px',
                fontSize: '14px',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Add
            </button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '9999px',
                fontSize: '14px',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Event Table */}
        <div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
              <Loader2 className="animate-spin" style={{ color: '#e5e7eb', marginBottom: '16px' }} size={48} />
              <p style={{ color: '#9ca3af', fontSize: '16px' }}>Loading your events...</p>
            </div>
          ) : (
            <EventTable
              events={events}
              searchTerm={searchTerm}
              onEdit={(ev) => { setSelectedEvent(ev); setIsFormOpen(true); }}
              onDeactivate={async (id) => { await barService.deactivateEvent(id); loadPageData(); }}
            />
          )}
        </div>

      </div>

      {isFormOpen && (
        <EventForm
          initialData={selectedEvent}
          onSuccess={() => { setIsFormOpen(false); loadPageData(); }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
