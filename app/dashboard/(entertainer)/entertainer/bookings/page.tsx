"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { BookingStatCard } from '../components/BookingStatCard';
import { EntertainerBookingTable } from '../components/EntertainerBookingTable';
import { SearchBar } from '../components/SearchBar';
import { entertainerServices } from '../../../../../src/features/home/services/entertainerServices';

export default function EntertainerBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await entertainerServices.getAllBookings();
      console.log('BOOKINGS RES:', res);

      const list: any[] = res?.bookings || res?.data || (Array.isArray(res) ? res : []);
      setBookings(list);

      // Compute counts from the list
      setCounts({
        total:    list.length,
        pending:  list.filter(b => b.status === 'pending').length,
        accepted: list.filter(b => b.status === 'accepted').length,
        rejected: list.filter(b => b.status === 'rejected').length,
      });
    } catch (err) {
      console.error(err);
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
            padding: '12px 24px', backgroundColor: '#fff',
            border: '1px solid #e5e7eb', borderRadius: '9999px',
            fontSize: '14px', color: '#111827', cursor: 'pointer',
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
          <EntertainerBookingTable
            bookings={bookings}
            searchTerm={searchTerm}
            onRefresh={loadData}
          />
        )}

      </div>
    </div>
  );
}