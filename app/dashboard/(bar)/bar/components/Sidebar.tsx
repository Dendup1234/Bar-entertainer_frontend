// app/dashboard/bar/components/Sidebar.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BarSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Entertainers', path: '/dashboard/bar' },
    { name: 'Events', path: '/dashboard/bar/events' },
    { name: 'Applications', path: '/dashboard/bar/applications' },
    { name: 'Bookings', path: '/dashboard/bar/booking' },
    { name: 'Reviews', path: '/dashboard/bar/reviews' },
  ];
  
  return (
    <aside className="w-64 border-r border-black/10 p-6 h-screen">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`block px-4 py-2.5 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-[#EAEAEA] text-black font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};