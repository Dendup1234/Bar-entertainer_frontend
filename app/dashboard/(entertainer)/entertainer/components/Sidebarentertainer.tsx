"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const EntertainerSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Events',       path: '/dashboard/entertainer' },
    { name: 'Applications', path: '/dashboard/entertainer/applications' },
    { name: 'Bookings',     path: '/dashboard/entertainer/bookings' },
    { name: 'Reviews',      path: '/dashboard/entertainer/reviews' },
  ];

  return (
    <aside className="w-64 border-r border-gray-100 p-6 h-screen">
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