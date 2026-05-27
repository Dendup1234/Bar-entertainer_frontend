import React, { useState } from 'react';
import { Star, CheckCircle, MapPin, Music, DollarSign, MessageSquare, User } from 'lucide-react';
import { BookingModal } from './BookingModal';

const DetailItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-[12px] leading-snug text-gray-700">
    <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center text-black">
      {icon}
    </div>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

export const EntertainerCard = ({
  _id,
  stageName,
  profileImage,
  entertainerType,
  genres,
  location,
  performanceFeeMin,
  performanceFeeMax,
  avgRating,
  reviewCount,
  bookingCount,
  latestComment,
}: any) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const displayName = stageName || 'Unknown Artist';
  const displayType = entertainerType || 'singer';
  const feeLabel = performanceFeeMin || performanceFeeMax
    ? `Nu. ${Number(performanceFeeMin || 0).toLocaleString()} - ${Number(performanceFeeMax || 0).toLocaleString()}`
    : 'Fee not provided';

  return (
    <>
      <div className="flex h-full min-h-[430px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="relative h-[180px] w-full shrink-0 bg-gray-100">
          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <User size={54} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-gray-900/85 px-3 py-1 text-[10px] font-medium capitalize text-white backdrop-blur-sm">
              {displayType}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 py-4">
          <h3 className="mb-2 text-[14px] font-semibold leading-tight text-gray-950">
            {displayName}
          </h3>

          <div className="space-y-1.5">
            <DetailItem icon={<Star size={13} />}>
              <span className="font-medium text-gray-900">{avgRating ?? '0.0'}</span>
              <span className="ml-1 text-gray-500">({reviewCount ?? 0} reviews)</span>
            </DetailItem>
            <DetailItem icon={<CheckCircle size={13} />}>{bookingCount ?? 0} Verified Booking</DetailItem>
            <DetailItem icon={<Music size={13} />}>{genres?.length ? genres.join(', ') : 'Genre not provided'}</DetailItem>
            <DetailItem icon={<MapPin size={13} />}>{location || 'Unknown'}</DetailItem>
            <DetailItem icon={<DollarSign size={13} />}>
              {feeLabel}
            </DetailItem>
          </div>

          <div className="mt-3 flex gap-2 text-[12px] italic leading-snug text-gray-500">
            <MessageSquare size={13} className="mt-0.5 shrink-0 text-black" />
            <p className="line-clamp-3">
              {latestComment ? `"${latestComment}"` : `"No reviews yet"`}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsBookingOpen(true); }}
            className="mt-auto w-full rounded-sm bg-[#202020] py-2 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            Book
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        entertainer={{ _id, stageName, profileImage, entertainerType, performanceFeeMin, performanceFeeMax }}
        onSuccess={() => {
          setIsBookingOpen(false);
          alert('Booking confirmed successfully!');
        }}
      />
    </>
  );
};
