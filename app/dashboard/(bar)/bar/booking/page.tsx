"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { BookingStatCard } from '../components/BookingStats';
import { BookingTable } from '../components/BookingTable';
import { SearchBar } from '../components/SearchBar';
import { barService } from '@/features/home/services/barServices';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadPageData(); }, []);

  const loadPageData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, countsRes] = await Promise.all([
        barService.getAllBookings(),
        barService.getBookingCounts(),
      ]);

      console.log('BOOKINGS RES:', bookingsRes);
      console.log('FIRST BOOKING:', bookingsRes?.bookings?.[0]);

      if (bookingsRes?.bookings) setBookings(bookingsRes.bookings);
      else if (Array.isArray(bookingsRes)) setBookings(bookingsRes);

      if (countsRes?.data) {
        setCounts({
          total:    countsRes.data.total    || 0,
          pending:  countsRes.data.pending  || 0,
          accepted: countsRes.data.accepted || 0,
          rejected: countsRes.data.rejected || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px', marginBottom: '48px' }}>
          <BookingStatCard label="Total"    value={counts.total} />
          <BookingStatCard label="Pending"  value={counts.pending} />
          <BookingStatCard label="Accepted" value={counts.accepted} />
          <BookingStatCard label="Rejected" value={counts.rejected} />
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <SearchBar
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search bookings"
          />
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 22px', backgroundColor: '#fff',
            border: '1px solid #e5e7eb', borderRadius: '9999px',
            fontSize: '13px', color: '#111827', cursor: 'pointer',
          }}>
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
            <Loader2 className="animate-spin" style={{ color: '#e5e7eb', marginBottom: '16px' }} size={48} />
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>Loading bookings...</p>
          </div>
        ) : (
          <BookingTable
            bookings={bookings}
            searchTerm={searchTerm}
          />
        )}

      </div>
    </div>
  );
}