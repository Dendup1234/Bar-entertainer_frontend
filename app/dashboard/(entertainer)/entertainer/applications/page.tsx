"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { BookingStatCard } from '../components/BookingStatCard';
import { SearchBar } from '../components/SearchBar';
import { entertainerServices } from '@/features/home/services/entertainerServices';

type ApplicationStatus = 'pending' | 'shortlisted' | 'accepted';

const tabs: Array<{ label: string; value: ApplicationStatus }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Shortlisted', value: 'shortlisted' },
  { label: 'Accepted', value: 'accepted' },
];

const statusLabel = (status?: string) => {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

const formatTime = (start?: string, end?: string) => {
  const fmt = (value?: string) => {
    if (!value) return '';
    if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  };

  const startLabel = fmt(start);
  const endLabel = fmt(end);
  if (!startLabel || !endLabel) return '—';

  return `${startLabel}–${endLabel}`;
};

const statusStyle = (status?: string): React.CSSProperties => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return { color: '#16a34a', fontWeight: 500 };
    case 'shortlisted':
      return { color: '#111827', fontWeight: 500 };
    case 'pending':
      return { color: '#d97706', fontWeight: 500 };
    default:
      return { color: '#6b7280', fontWeight: 500 };
  }
};

export default function EntertainerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('shortlisted');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await entertainerServices.getApplications();
      const list = Array.isArray(res?.applications)
        ? res.applications
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setApplications(list);
    } catch (err) {
      console.error('Failed to load applications:', err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((application) => application.status === 'pending').length,
    shortlisted: applications.filter((application) => application.status === 'shortlisted').length,
    accepted: applications.filter((application) => application.status === 'accepted').length,
  }), [applications]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return applications.filter((application) => {
      const event = application.event || {};
      const matchesTab = application.status === activeTab;
      const matchesSearch = [
        event.title,
        event.city,
        event.venueAddress,
        application.status,
      ].some((value) => String(value || '').toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, applications, searchTerm]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px', marginBottom: '48px' }}>
          <BookingStatCard label="Total" value={counts.total} />
          <BookingStatCard label="Pending" value={counts.pending} />
          <BookingStatCard label="Shortlisted" value={counts.shortlisted} />
          <BookingStatCard label="Accepted" value={counts.accepted} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <SearchBar
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search applications"
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '34px', borderBottom: '1px solid #d1d5db', marginBottom: '26px' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '0 18px 14px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
                  color: isActive ? '#111827' : '#d1d5db',
                  fontSize: '13px',
                  fontWeight: isActive ? 500 : 400,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
            <Loader2 className="animate-spin" style={{ color: '#e5e7eb', marginBottom: '16px' }} size={48} />
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>Loading applications...</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Sl', 'Date', 'Event Name', 'Event Type', 'Offered Amount', 'Status', 'Time'].map((header) => (
                    <th key={header} style={{
                      padding: '18px 16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#c0c8d4',
                      borderBottom: '1px solid #f3f4f6',
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((application, index) => {
                  const event = application.event || {};
                  return (
                    <tr
                      key={application._id || index}
                      style={{ borderBottom: '1px solid #f9fafb' }}
                      onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = '#fafafa')}
                      onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '20px 16px', fontSize: '12px', color: '#111827' }}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '12px', color: '#374151' }}>
                        {formatDate(event.eventDate || application.createdAt)}
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '13px', color: '#111827' }}>
                        {event.title || '—'}
                      </td>
                      <td style={{ padding: '20px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          padding: '5px 16px',
                          minWidth: '72px',
                          justifyContent: 'center',
                          borderRadius: '9999px',
                          backgroundColor: '#d1d5db',
                          color: '#111827',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}>
                          {event.isPublic ? 'Public' : 'Private'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '12px', color: '#111827' }}>
                        {event.offeredAmount ? `Nu. ${Number(event.offeredAmount).toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '12px', ...statusStyle(application.status) }}>
                        {statusLabel(application.status)}
                      </td>
                      <td style={{ padding: '20px 16px', fontSize: '12px', color: '#111827', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                        {formatTime(event.startTime, event.endTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
                <p style={{ fontSize: '12px', color: '#d1d5db' }}>No {activeTab} applications found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
