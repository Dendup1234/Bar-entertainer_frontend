"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, UserRole } from '@/features/auth/services/authservices';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserRole>('Entertainer');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const isFormValid = email.trim().length > 0 && email.includes('@');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    try {
      // Pass the userType so the service hits the correct endpoint
      await authService.sendResetOtp(userType, email);

      // Pass both email and role to the verification page
      router.push(`/verify2?email=${encodeURIComponent(email)}&role=${encodeURIComponent(userType)}`);
      
    } catch (err: any) {
      console.error("Forgot Password Error:", err.message);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-black">
      <div className="w-full max-w-[400px] space-y-8 bg-white text-center">
        
        {/* Role Selection Added */}
        <div className="flex justify-center space-x-10 mb-4">
          {(['Entertainer', 'Event Organizer'] as UserRole[]).map((role) => (
            <label key={role} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${userType === role ? 'border-black' : 'border-gray-300'}`}>
                {userType === role && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
              </div>
              <input 
                type="radio" 
                className="hidden" 
                checked={userType === role} 
                onChange={() => setUserType(role)} 
              />
              <span className={`text-[15px] ${userType === role ? 'text-black' : 'text-gray-700'}`}>{role}</span>
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Forgot your password?</h1>
          <p className="text-[14px] text-gray-500">
            Enter your email address.<br />
            We will send an OTP to retrieve your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2.5">
            <label className="text-[15px] font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sonam@gmail.com"
              className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 transition-colors disabled:bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-md font-semibold text-[16px] transition-all duration-300 uppercase tracking-widest shadow-sm ${
              isFormValid && !loading
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
