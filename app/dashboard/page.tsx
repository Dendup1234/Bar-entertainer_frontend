"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/features/auth/services/authUtils';

export default function DashboardGateway() {
  const router = useRouter();

  useEffect(() => {
    const role = authUtils.getRole();

    if (role === 'Entertainer') {
      router.replace('/dashboard/entertainer');
    } else if (role === 'Event Organizer') {
      router.replace('/dashboard/bar');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      Loading dashboard...
    </div>
  );
}
