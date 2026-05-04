"use client";
import React, { useState, useEffect } from 'react';
import { profileService } from '@/features/profile/services/profileservices';
import { BarProfileForm } from './components/BarProfileForm';
import { BarEditModal } from './components/BarEditModal';

export default function BarProfilePage() { // Renamed for clarity
    const [profile, setProfile] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfileData = async () => {
        setLoading(true);
        const storedData = localStorage.getItem('auth-storage');
        let token = '';

        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                // Accessing the zustand/auth state properly
                token = parsed.state?.token || '';
            } catch (e) {
                console.error("Error parsing auth-storage:", e);
            }
        }

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // HARDCODED 'bar' ROLE: This ensures this page ALWAYS 
            // requests bar data, even if the routing changes slightly.
            const role = 'bar'; 
            const data = await profileService.getProfile(role, token);
            setProfile(data.profile || data);
        } catch (err) {
            console.error("Failed to fetch bar profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-100">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="px-12 py-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-10">
                Bar Profile
            </h1>
            
            {profile ? (
                <div className="bg-white rounded-4xl border border-gray-100 p-2 shadow-sm">
                    <BarProfileForm user={profile} onOpenEdit={() => setIsEditOpen(true)} />
                    <BarEditModal  
                        isOpen={isEditOpen} 
                        onClose={() => setIsEditOpen(false)} 
                        user={profile} 
                        onSaveSuccess={fetchProfileData} 
                    />
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-4xl py-20 text-center shadow-sm">
                    <p className="text-gray-400">No profile data found for this bar.</p>
                </div>
            )}
        </div>
    );
}