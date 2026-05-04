// app/dashboard/entertainer/components/EventCard.tsx
export const EventCard = ({ title, venue, date, genre }: any) => (
  <div className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="h-40 bg-gray-200 rounded-lg mb-4" /> 
    <h3 className="font-bold text-lg">{title}</h3>
    <div className="space-y-1.5 text-sm text-gray-600 mb-6">
      <p>📍 {venue}</p>
      <p>📅 {date}</p>
      <p>🎵 {genre}</p>
    </div>
    <button className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800">
      Apply Now
    </button>
  </div>
);