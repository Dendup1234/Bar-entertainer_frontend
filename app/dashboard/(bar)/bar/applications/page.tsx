"use client";
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { BookingStatCard } from '../components/BookingStats';
import { SearchBar } from '../components/SearchBar';
import { barService } from '@/features/home/services/barServices';
import { FilterButton, dashboardToolbarStyle } from '@/components/dashboard/DashboardControls';

type TabType = 'Pending' | 'Shortlisted' | 'Accepted';

export default function ApplicationsPage() {
  const [allApps, setAllApps] = useState<any[]>([]);
  const [shortlistedApps, setShortlistedApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('Pending');
  const [eventTypeFilter, setEventTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [generalRes, shortRes] = await Promise.all([
        barService.getApplications(),
        barService.getShortlistedApplications()
      ]);
      setAllApps(generalRes.applications || []);
      setShortlistedApps(shortRes.applications || []);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'shortlisted' | 'accepted' | 'rejected') => {
    try {
      await barService.updateApplicationStatus(id, newStatus);
      await fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const counts = {
    total: allApps.length,
    pending: allApps.filter(a => a.status === 'pending').length,
    shortlisted: shortlistedApps.length,
    accepted: allApps.filter(a => a.status === 'accepted').length,
  };

  const tableData = activeTab === 'Shortlisted'
    ? shortlistedApps
    : allApps.filter(a => a.status === activeTab.toLowerCase());

  const filtered = tableData.filter((app: any) => {
    const query = searchTerm.toLowerCase();
    const eventType = app.event?.isPublic ? 'Public' : 'Private';
    const matchesType = eventTypeFilter === 'All' || eventType === eventTypeFilter;
    const matchesSearch =
      (app.entertainer?.stageName || '').toLowerCase().includes(query) ||
      (app.event?.title || '').toLowerCase().includes(query);

    return matchesType && matchesSearch;
  });

  const headers = ['SI', 'DATE', 'ENTERTAINER', 'TYPE', 'EVENT NAME', 'EVENT TYPE', 'OFFERED AMOUNT', 'STATUS', 'ACTION'];

  return (
    <div style={{ padding: '40px 48px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
          <BookingStatCard label="Total"       value={counts.total} />
          <BookingStatCard label="Pending"     value={counts.pending} />
          <BookingStatCard label="Shortlisted" value={counts.shortlisted} />
          <BookingStatCard label="Accepted"    value={counts.accepted} />
        </div>

        {/* Toolbar */}
        <div style={{ ...dashboardToolbarStyle, marginBottom: '32px' }}>
          <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <FilterButton
            label={eventTypeFilter === 'All' ? 'Filter' : eventTypeFilter}
            onClick={() => setEventTypeFilter((current) => current === 'All' ? 'Public' : current === 'Public' ? 'Private' : 'All')}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid #f3f4f6', marginBottom: '24px' }}>
          {(['Pending', 'Shortlisted', 'Accepted'] as TabType[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 0', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '14px',
              color: activeTab === tab ? '#111827' : '#9ca3af',
              fontWeight: activeTab === tab ? 600 : 400,
              borderBottom: activeTab === tab ? '2px solid #111827' : '2px solid transparent',
              transition: 'all 0.15s',
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 className="animate-spin" style={{ color: '#e5e7eb' }} size={36} />
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {headers.map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: '11px', fontWeight: 400,
                      color: '#c0c8d4', letterSpacing: '0.08em',
                      whiteSpace: 'nowrap', borderBottom: '1px solid #f3f4f6',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} style={{ padding: '64px 16px', textAlign: 'center', fontSize: '13px', color: '#d1d5db' }}>
                      No applications found
                    </td>
                  </tr>
                ) : filtered.map((app: any, i) => (
                  <tr
                    key={app._id}
                    style={{ borderBottom: '1px solid #f9fafb' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* SI */}
                    <td style={{ padding: '20px 16px', fontSize: '11px', color: '#c0c8d4', fontFamily: 'monospace' }}>
                      {String(i + 1).padStart(2, '0')}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {app.event?.eventDate
                        ? new Date(app.event.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                        : '—'}
                    </td>

                    {/* Entertainer */}
                    <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      {app.entertainer?.stageName || '—'}
                    </td>

                    {/* Type */}
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '5px 14px', borderRadius: '9999px',
                        fontSize: '12px', backgroundColor: '#f3f4f6', color: '#374151',
                      }}>
                        {app.entertainer?.entertainerType || app.entertainer?.bio?.entertainerType || '—'}
                      </span>
                    </td>

                    {/* Event Name */}
                    <td style={{ padding: '20px 16px', fontSize: '13px', color: '#374151' }}>
                      {app.event?.title || '—'}
                    </td>

                    {/* Event Type */}
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center',
                        padding: '5px 14px', borderRadius: '9999px',
                        fontSize: '12px',
                        backgroundColor: app.event?.isPublic ? '#1f2937' : '#f3f4f6',
                        color: app.event?.isPublic ? '#fff' : '#6b7280',
                      }}>
                        {app.event?.isPublic ? 'Public' : 'Private'}
                      </span>
                    </td>

                    {/* Offered Amount */}
                    <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      {app.offeredAmount ? `Nu. ${app.offeredAmount.toLocaleString()}` : '—'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '20px 16px', fontSize: '13px', color: '#6b7280', textTransform: 'capitalize' }}>
                      {app.status || '—'}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '20px 16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {activeTab === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'shortlisted')}
                            style={{
                              fontSize: '12px', fontWeight: 500, color: '#111827',
                              textDecoration: 'underline', textUnderlineOffset: '2px',
                              border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                            }}
                          >
                            Shortlist
                          </button>
                        )}
                        {activeTab === 'Shortlisted' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(app._id, 'accepted')}
                              style={{
                                fontSize: '12px', fontWeight: 500, color: '#111827',
                                textDecoration: 'underline', textUnderlineOffset: '2px',
                                border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                              }}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(app._id, 'rejected')}
                              style={{
                                fontSize: '12px', fontWeight: 500, color: '#dc2626',
                                textDecoration: 'underline', textUnderlineOffset: '2px',
                                border: 'none', background: 'none', cursor: 'pointer', padding: 0,
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
