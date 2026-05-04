"use client";

import React, { useState, Suspense } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService, UserRole } from '@/features/auth/services/authservices';

const ResetPasswordContent = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Get token AND role from URL
  const resetToken = searchParams.get('token') || "";
  const role = searchParams.get('role') as UserRole || 'Entertainer';

  const isFormValid = formData.password.length > 0 && formData.password === formData.confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    if (!resetToken) {
      alert("Reset token is missing. Please start the process again.");
      router.push('/forgot_password');
      return;
    }

    setLoading(true);
    try {
      // 2. Pass the role to the service
      await authService.setNewPassword(role, resetToken, formData.password);
      
      alert("Password updated successfully! Please login with your new password.");
      router.push('/login'); 
    } catch (err: any) {
      console.error("Reset Error:", err.message);
      alert(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-black">
      <div className="w-full max-w-[420px] space-y-8 bg-white text-center">
        <h1 className="text-2xl font-semibold">Create new password</h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* ... (Your input fields remain the same) ... */}
          <div className="space-y-2.5 relative">
            <label className="text-[15px] font-medium text-black">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter new password"
                disabled={loading}
                className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 disabled:bg-gray-50"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[15px] font-medium text-black">Confirm Password</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Confirm new password"
              disabled={loading}
              className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 disabled:bg-gray-50"
              onChange={(e) => setFormData({...formData, confirm: e.target.value})}
            />
            {formData.confirm && formData.password !== formData.confirm && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-md font-semibold text-[16px] uppercase tracking-widest transition-all duration-300 shadow-sm ${
              isFormValid && !loading
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Updating..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;