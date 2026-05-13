import React, { useState } from 'react';
import { Star, CheckCircle, MapPin, Music, DollarSign, MessageSquare } from 'lucide-react';
import { BookingModal } from './BookingModal';

const DetailItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-start gap-3 text-sm text-gray-700">
    <div className="w-4 h-4 flex items-center justify-center mt-0.5 text-gray-500">
      {icon}
    </div>
    <div className="flex-1">{children}</div>
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

  return (
    <>
      <div className="w-75 bg-[#f4f4f4] border border-gray-200 rounded-2xl overflow-hidden">

        <div className="relative w-full h-30">
          <img
            src={profileImage || '/placeholder.jpg'}
            alt={stageName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-medium capitalize">
              {entertainerType || 'dj'}
            </span>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          <h3 className="text-base font-semibold text-gray-900 leading-tight">
            {stageName || 'Unknown Artist'}
          </h3>

          <div className="space-y-1.5">
            <DetailItem icon={<Star size={13} />}>
              <span className="font-medium text-gray-900">{avgRating ?? '0.0'}</span>
              <span className="text-gray-500 ml-1">({reviewCount ?? 0} reviews)</span>
            </DetailItem>
            <DetailItem icon={<CheckCircle size={13} />}>{bookingCount ?? 0} Verified Booking</DetailItem>
            <DetailItem icon={<Music size={13} />}>{genres?.length ? genres.join(', ') : 'No genres'}</DetailItem>
            <DetailItem icon={<MapPin size={13} />}>{location || 'Unknown'}</DetailItem>
            <DetailItem icon={<DollarSign size={13} />}>
              Nu. {performanceFeeMin?.toLocaleString() || 0} – {performanceFeeMax?.toLocaleString() || 0}
            </DetailItem>
          </div>

          <div className="flex gap-3 text-sm text-gray-500 italic pt-1">
            <MessageSquare size={13} className="mt-0.5" />
            <p className="leading-snug line-clamp-2">
              {latestComment ? `"${latestComment}"` : `"No reviews yet"`}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setIsBookingOpen(true); }}
            className="w-full py-2 bg-black text-white rounded-lg text-sm font-medium"
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
