export const BarProfileForm = ({ user, onOpenEdit }: any) => {
  return (
    <div className="bg-white border rounded-2xl p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{user?.businessName || "No Name"}</h2>
          <p className="text-gray-500 font-medium">{user?.email}</p>
        </div>
        <button onClick={onOpenEdit} className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t pt-6">
        <DataField label="Owner Name" value={user?.ownerName} />
        <DataField label="Phone" value={user?.phone} />
        <DataField label="Venue Type" value={user?.venueType} />
        <DataField label="Address" value={user?.address} />
        <div className="col-span-2">
          <DataField label="Description" value={user?.description} />
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <p className="text-gray-900 font-semibold mt-1">{value || "—"}</p>
  </div>
);