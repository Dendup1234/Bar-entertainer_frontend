"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { profileService } from '@/features/profile/services/profileservices';
import { useAuthStore } from '@/features/auth/store/authstore';
import { authUtils } from '@/features/auth/services/authUtils';

type DashboardRole = 'bar' | 'entertainer';

const getStoredDashboardRole = (): DashboardRole | null => {
  const storedRole = authUtils.getRole();

  if (storedRole === 'Entertainer' || storedRole === 'entertainer') return 'entertainer';
  if (storedRole === 'Event Organizer' || storedRole === 'bar') return 'bar';

  return null;
};

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [profileImage, setProfileImage] = useState(authUser?.profileImage || '');
  const [imageFailed, setImageFailed] = useState(false);
  const [storedRole, setStoredRole] = useState<DashboardRole | null>(null);

  const routeRole: DashboardRole | null = pathname.startsWith('/dashboard/entertainer')
    ? 'entertainer'
    : pathname.startsWith('/dashboard/bar')
      ? 'bar'
      : null;
  const activeRole = storedRole || routeRole;
  const role = activeRole || 'bar';

  const profileHref = role === 'entertainer' ? '/dashboard/entertainer/profile' : '/dashboard/bar/profile';

  useEffect(() => {
    const syncStoredRole = () => setStoredRole(getStoredDashboardRole());

    syncStoredRole();
    window.addEventListener('storage', syncStoredRole);

    return () => window.removeEventListener('storage', syncStoredRole);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProfileImage = async () => {
      if (!token || !activeRole) return;

      try {
        const data = await profileService.getProfile(activeRole, token);
        const profile = data.profile || data.data || data;
        if (!cancelled) {
          setProfileImage(profile?.profileImage || authUser?.profileImage || '');
          setImageFailed(false);
        }
      } catch (err) {
        if (!cancelled) {
          setProfileImage(authUser?.profileImage || '');
          setImageFailed(false);
        }

        const status = (err as { status?: number }).status;
        if (status !== 404) {
          console.error('Failed to load top bar profile image:', err);
        }
      }
    };

    loadProfileImage();

    const handleProfileUpdated = () => loadProfileImage();
    window.addEventListener('profile-updated', handleProfileUpdated);
    window.addEventListener('focus', handleProfileUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('profile-updated', handleProfileUpdated);
      window.removeEventListener('focus', handleProfileUpdated);
    };
  }, [activeRole, authUser?.profileImage, token]);

  const handleLogout = () => {
    logout();
    authUtils.clearAuth();
    setProfileImage('');
    router.replace('/login');
  };

  return (
    <header className="h-20 border-b border-gray-100 bg-white flex items-center px-8 sticky top-0 z-10 w-full">
      
      <div className="flex-1" />

      <div className="flex items-center gap-6">
        
        <button className="text-gray-400 hover:text-black transition-colors p-1">
          <Bell size={20} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="text-gray-400 hover:text-black transition-colors p-1"
        >
          <LogOut size={20} />
        </button>

        {/* This href is now dynamic instead of /dashboard/profile */}
        <Link 
          href={profileHref} 
          className="flex items-center transition-transform active:scale-95"
          aria-label="Open profile"
        >
          {profileImage && !imageFailed ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-semibold">
              {role === 'bar' ? 'B' : 'E'}
            </div>
          )}
        </Link>
      </div>

    </header>
  );
};
