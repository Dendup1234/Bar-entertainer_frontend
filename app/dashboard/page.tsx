"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/features/auth/services/authUtils';

export default function DashboardGateway() {
  const router = useRouter();

  useEffect(() => {
  console.log("ALL LOCAL STORAGE KEYS:", Object.keys(localStorage));
  console.log("CONTENT OF 'state':", localStorage.getItem('state'));
  console.log("CONTENT OF 'persist:root':", localStorage.getItem('persist:root'));
}, []);

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

  return <div>Loading dashboard...</div>;
}