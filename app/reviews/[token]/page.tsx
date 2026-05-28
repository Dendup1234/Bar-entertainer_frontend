"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_BASE_URL, ENDPOINTS } from '@/constants/apis';

type ReviewData = {
  event?: {
    title?: string;
    eventName?: string;
    venueAddress?: string;
    city?: string;
    eventDate?: string;
  };
  entertainer?: {
    stageName?: string;
    name?: string;
    entertainerType?: string;
    profileImage?: string;
  };
};

type RatingField = 'performanceRating' | 'crowdEngagementRating' | 'professionalismRating';

const ratingGroups: Array<{ key: RatingField; label: string }> = [
  { key: 'performanceRating', label: 'How do you rate the performance quality?' },
  { key: 'crowdEngagementRating', label: 'How do you rate the crowd engagement?' },
  { key: 'professionalismRating', label: 'How do you rate the professionalism?' },
];

const getDeviceId = () => {
  const storageKey = 'review-device-id';
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(storageKey, id);
  return id;
};

const requestJson = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export default function ReviewTokenPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState<Record<RatingField, number | null>>({
    performanceRating: null,
    crowdEngagementRating: null,
    professionalismRating: null,
  });
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError('');
    requestJson(ENDPOINTS.PUBLIC_REVIEW.VALIDATE(token))
      .then((data) => setReviewData({ event: data.event, entertainer: data.entertainer }))
      .catch((err) => setError(err instanceof Error ? err.message : 'This review link is not valid.'))
      .finally(() => setLoading(false));
  }, [token]);

  const eventName = useMemo(
    () => reviewData?.event?.eventName || reviewData?.event?.title || 'Event Review',
    [reviewData],
  );

  const entertainerName = useMemo(
    () => reviewData?.entertainer?.stageName || reviewData?.entertainer?.name || '',
    [reviewData],
  );

  const isComplete = ratingGroups.every((group) => ratings[group.key]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !isComplete || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      await requestJson(ENDPOINTS.PUBLIC_REVIEW.SUBMIT(token), {
        method: 'POST',
        body: JSON.stringify({
          performanceRating: ratings.performanceRating,
          crowdEngagementRating: ratings.crowdEngagementRating,
          professionalismRating: ratings.professionalismRating,
          comment: comment.trim(),
          deviceId: getDeviceId(),
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-5 text-black">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-500">
          Loading review form...
        </div>
      </main>
    );
  }

  if (error && !reviewData) {
    return (
      <main className="min-h-screen bg-white p-5 text-black">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 p-8">
          <h1 className="text-lg font-semibold">Review link unavailable</h1>
          <p className="mt-3 text-sm text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-white p-5 text-black">
        <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 p-8 text-center">
          <h1 className="text-xl font-semibold">Thank you for your review</h1>
          <p className="mt-3 text-sm text-gray-600">Your feedback has been submitted successfully.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-5 text-black">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl rounded-lg border border-gray-200 px-7 py-6">
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-lg font-semibold">{eventName}</h1>
          {entertainerName && (
            <p className="mt-1 text-sm text-gray-500">Reviewing {entertainerName}</p>
          )}
        </div>

        <div className="space-y-14">
          {ratingGroups.map((group) => (
            <fieldset key={group.key}>
              <legend className="mb-4 text-[13px] font-semibold text-black">{group.label}</legend>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="flex w-fit cursor-pointer items-center gap-3 text-[13px] text-black">
                    <input
                      type="radio"
                      name={group.key}
                      value={rating}
                      checked={ratings[group.key] === rating}
                      onChange={() => setRatings((current) => ({ ...current, [group.key]: rating }))}
                      className="h-3.5 w-3.5 accent-black"
                    />
                    {rating} stars
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <div>
            <label htmlFor="comment" className="mb-4 block text-[13px] font-semibold text-black">
              Leave some comment(optional)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              className="min-h-[210px] w-full resize-y rounded border border-gray-300 bg-white p-4 text-sm text-black outline-none focus:border-black"
            />
            <p className="mt-2 text-right text-xs text-gray-400">{comment.length}/1000</p>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={!isComplete || submitting}
            className="rounded-lg bg-black px-8 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </main>
  );
}
