"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircle, User, X } from 'lucide-react';
import { BookingStatCard } from '../components/BookingStatCard';
import { SearchBar } from '../components/SearchBar';
import { entertainerServices } from '@/features/home/services/entertainerServices';
import { FilterButton, dashboardToolbarStyle } from '@/components/dashboard/DashboardControls';

type ReviewRow = {
  _id: string;
  entertainerId?: string;
  entertainer?: string;
  type?: string;
  eventName?: string;
  eventType?: string;
  noOfReviews?: number;
  avgRating?: number;
};

type ReviewCursor = {
  cursorCreatedAt?: string;
  cursorId?: string;
} | null;

const formatRating = (value?: number) => {
  if (value === undefined || value === null) return '0';
  return Number(value).toFixed(2).replace(/\.?0+$/, '');
};

const formatDateTime = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const RatingMark = () => (
  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] bg-black" />
);

const ReviewProfileModal = ({
  eventId,
  isOpen,
  onClose,
}: {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState<ReviewCursor[]>([null]);
  const commentsPerPage = 6;

  const loadProfile = async (cursor: ReviewCursor = null) => {
    if (!eventId) return;

    setLoading(true);
    try {
      const res = await entertainerServices.getReviewProfile(eventId, {
        limit: commentsPerPage,
        ...(cursor || {}),
      });
      setProfile(res?.data || res);
    } catch (err) {
      console.error('Failed to load review profile', err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !eventId) return;

    setProfile(null);
    setPageIndex(0);
    setPageCursors([null]);
    loadProfile(null);
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  const event = profile?.event || {};
  const ratings = profile?.ratings || {};
  const commentsInfo = profile?.comments || {};
  const comments = commentsInfo?.data || [];
  const entertainer = profile?.selectedEntertainer || {};
  const hasNextPage = !!commentsInfo?.hasNextPage;
  const hasPreviousPage = pageIndex > 0;
  const eventImage = event.image || entertainer.profileImage || '';
  const requirements = Array.isArray(event.entertainerRequirement) ? event.entertainerRequirement : [];
  const genres = Array.isArray(event.genresPreferred) ? event.genresPreferred : [];

  const handleNext = () => {
    if (!hasNextPage || !commentsInfo.nextCursor) return;

    const nextIndex = pageIndex + 1;
    const nextCursor = commentsInfo.nextCursor;
    setPageCursors((current) => [...current.slice(0, nextIndex), nextCursor]);
    setPageIndex(nextIndex);
    loadProfile(nextCursor);
  };

  const handlePrevious = () => {
    if (!hasPreviousPage) return;

    const previousIndex = pageIndex - 1;
    const previousCursor = pageCursors[previousIndex] || null;
    setPageIndex(previousIndex);
    loadProfile(previousCursor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white"
        >
          <X size={15} />
        </button>

        {loading ? (
          <div className="flex min-h-[520px] items-center justify-center">
            <Loader2 className="animate-spin text-gray-900" size={30} />
          </div>
        ) : (
          <div className="overflow-y-auto">
            <div className="bg-[#cfcfcf] px-6 py-5 text-center">
              <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                {eventImage ? (
                  <img src={eventImage} alt={event.eventName || 'Event'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    <User size={28} />
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-base font-semibold text-black">{event.eventName || 'Review Details'}</h2>
              <p className="mt-1 text-xs text-gray-600">{event.eventType || '-'}</p>

              <div className="mx-auto mt-7 grid max-w-xs grid-cols-2 gap-10">
                <div>
                  <p className="text-2xl font-medium leading-none text-black">{ratings.totalReviews ?? 0}</p>
                  <p className="mt-1 text-xs text-black">Reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-medium leading-none text-black">{formatRating(ratings.overallRating)}</p>
                  <p className="mt-1 text-xs text-black">Overall Rating</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <section className="mb-7">
                <p className="mb-4 text-xs font-semibold text-black">Event Name</p>
                <p className="pl-7 text-xs text-black">{event.eventName || '-'}</p>
              </section>

              <section className="mb-7">
                <p className="mb-4 text-xs font-semibold text-black">Selected Entertainer</p>
                <div className="flex items-center gap-2 pl-7 text-xs text-black">
                  <User size={13} fill="currentColor" />
                  {entertainer.stageName || entertainer.name || '-'}
                </div>
              </section>

              <section className="mb-7">
                <p className="mb-4 text-xs font-semibold text-black">Ratings</p>
                <div className="space-y-3 text-xs text-black">
                  <div className="flex items-center gap-2"><RatingMark /> Performance Quality: {formatRating(ratings.performanceQuality)}</div>
                  <div className="flex items-center gap-2"><RatingMark /> Crowd Engagement: {formatRating(ratings.crowdEngagement)}</div>
                  <div className="flex items-center gap-2"><RatingMark /> Professionalism: {formatRating(ratings.professionalism)}</div>
                </div>
              </section>

              <section className="mb-7">
                <p className="mb-4 text-xs font-semibold text-black">Entertainer Requirement</p>
                <div className="space-y-3 pl-7 text-xs text-black">
                  <div>Type: {requirements.length ? requirements.join(', ') : '-'}</div>
                  <div>Genres: {genres.length ? genres.join(', ') : '-'}</div>
                </div>
              </section>

              <section>
                <p className="mb-4 text-xs font-semibold text-black">Comments({commentsInfo.total ?? 0})</p>
                <div className="space-y-3">
                  {comments.length ? comments.map((comment: any) => (
                    <div key={comment._id} className="flex items-start gap-2 text-xs text-black">
                      <MessageCircle size={14} fill="currentColor" className="mt-0.5 shrink-0" />
                      <div>
                        <p>{comment.comment || 'No written comment.'}</p>
                        {(comment.reviewerLabel || comment.createdAt) && (
                          <p className="mt-1 text-[11px] text-gray-500">
                            {[comment.reviewerLabel, formatDateTime(comment.createdAt)].filter(Boolean).join(' | ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400">No visible comments yet.</p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={!hasPreviousPage}
                    className="text-black underline underline-offset-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">Page {pageIndex + 1}</span>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNextPage}
                    className="text-black underline underline-offset-2 disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline"
                  >
                    Next
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EntertainerReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Public' | 'Private'>('All');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    entertainerServices.getReviewStats()
      .then((res) => setRows(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to load review stats', err);
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalReviews = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.noOfReviews || 0), 0),
    [rows],
  );

  const publicEventCount = useMemo(
    () => rows.filter((row) => row.eventType === 'Public').length,
    [rows],
  );

  const privateEventCount = useMemo(
    () => rows.filter((row) => row.eventType === 'Private').length,
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch = [
        row.entertainer,
        row.type,
        row.eventName,
        row.eventType,
      ].some((value) => String(value || '').toLowerCase().includes(query));
      const matchesFilter = filterType === 'All' || row.eventType === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [filterType, rows, search]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', padding: '40px 48px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px', marginBottom: '48px' }}>
          <BookingStatCard label="Total Reviews" value={totalReviews} />
          <BookingStatCard label="Public Events" value={publicEventCount} />
          <BookingStatCard label="Private Events" value={privateEventCount} />
        </div>

        <div style={dashboardToolbarStyle}>
          <SearchBar
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviews"
          />
          <FilterButton
            label={filterType === 'All' ? 'Filter' : filterType}
            onClick={() => setFilterType((current) => current === 'All' ? 'Public' : current === 'Public' ? 'Private' : 'All')}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
            <Loader2 className="animate-spin" style={{ color: '#e5e7eb', marginBottom: '16px' }} size={48} />
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>Loading reviews...</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['ID', 'ENTERTAINER', 'TYPE', 'EVENT NAME', 'EVENT TYPE', 'NO. OF REVIEWS', 'AVG. RATING', 'ACTION'].map((header) => (
                    <th key={header} style={{
                      padding: '18px 16px',
                      textAlign: header === 'ACTION' ? 'right' : 'left',
                      fontSize: '11px',
                      fontWeight: 400,
                      color: '#c0c8d4',
                      borderBottom: '1px solid #f3f4f6',
                      whiteSpace: 'nowrap',
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.length ? filteredRows.map((row, index) => (
                  <tr
                    key={row._id}
                    style={{ borderBottom: '1px solid #f9fafb', transition: 'background-color 0.2s' }}
                    onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = '#fafafa')}
                    onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '20px 16px', fontSize: '12px', color: '#111827' }}>
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>
                      {row.entertainer || '-'}
                    </td>
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '5px 16px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: '#e5e7eb',
                        color: '#111827',
                        minWidth: '70px',
                        justifyContent: 'center',
                        textTransform: 'capitalize',
                      }}>
                        {row.type || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '13px', color: '#4b5563' }}>{row.eventName || '-'}</td>
                    <td style={{ padding: '20px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '5px 16px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor: row.eventType === 'Public' ? '#d1d5db' : '#e5e7eb',
                        color: '#111827',
                        minWidth: '70px',
                        justifyContent: 'center',
                      }}>
                        {row.eventType || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 16px', fontSize: '13px', color: '#4b5563' }}>{row.noOfReviews ?? 0}</td>
                    <td style={{ padding: '20px 16px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>{formatRating(row.avgRating)}</td>
                    <td style={{ padding: '20px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedEventId(row._id)}
                        style={{
                          fontSize: '13px',
                          color: '#111827',
                          fontWeight: 500,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                        }}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} style={{ padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                      No review data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ReviewProfileModal
        eventId={selectedEventId}
        isOpen={!!selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </div>
  );
}
