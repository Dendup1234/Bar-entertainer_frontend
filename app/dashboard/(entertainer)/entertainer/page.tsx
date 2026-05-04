// app/dashboard/entertainer/page.tsx
import React from 'react';
import { EventCard } from './components/EventCard';

const MOCK_EVENTS = [
  { id: 1, title: 'Event 123', venue: 'Old Factory', date: '18th November 2026', genre: 'Pop song, Country song' },
  { id: 2, title: 'Event 123', venue: 'Old Factory', date: '18th November 2026', genre: 'Pop song, Country song' },
];

export default function EntertainerDashboard() {
  // REMOVED: <EntertainerSidebar /> and the outer flex div
  return (
    <div className="p-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-4 mb-8">
        <input 
          type="search" 
          placeholder="Search" 
          className="w-full max-w-md border border-gray-200 p-3 rounded-lg" 
        />
        <button className="border border-gray-200 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Filter
        </button>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((evt) => (
          <EventCard key={evt.id} {...evt} />
        ))}
      </div>
    </div>
  );
}