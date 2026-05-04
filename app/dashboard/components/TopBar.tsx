"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export const TopBar = () => {
  const pathname = usePathname();


  const profileHref = pathname.startsWith('/dashboard/entertainer')
    ? '/dashboard/entertainer/profile'
    : '/dashboard/bar/profile';

  return (
    <header className="h-20 border-b border-gray-100 bg-white flex items-center px-8 sticky top-0 z-10 w-full">
      
      <div className="flex-1" />

      <div className="flex items-center gap-6">
        
        <button className="text-gray-400 hover:text-black transition-colors p-1">
          <Bell size={20} />
        </button>

        {/* This href is now dynamic instead of /dashboard/profile */}
        <Link 
          href={profileHref} 
          className="flex items-center transition-transform active:scale-95"
        >
          <img 
            src="https://github.com/shadcn.png" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        </Link>
      </div>

    </header>
  );
};