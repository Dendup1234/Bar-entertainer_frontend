import { EntertainerSidebar } from './entertainer/components/Sidebarentertainer';

export default function EntertainerGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Sidebar Area */}
      <aside className="h-full shrink-0 border-r border-gray-100 bg-white">
        <EntertainerSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}