"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService, UserRole } from '@/features/auth/services/authservices';

const VerifyContent = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. Get both email and role from URL
  const email = searchParams.get('email') || "";
  const role = searchParams.get('role') as UserRole || 'Entertainer';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isFormValid = otp.every(digit => digit !== '');

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    const otpString = otp.join('');

    if (!email) {
        alert("Email is missing. Please try registering again.");
        return;
    }

    setLoading(true);
    try {
      // 2. Pass 'role' to verifyOtp so it calls /api/entertainer/verify-otp or /api/bar/verify-otp
      const result = await authService.verifyOtp(role, email, otpString);
      
      console.log("Success:", result.message);
      router.push('/login');
    } catch (err: any) {
      console.error("Verification Error Detail:", err);
      alert(err.message || "Invalid OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-black">
      <div className="w-full max-w-125 border border-gray-100 rounded-xl p-8 md:p-16 space-y-8 bg-white shadow-sm">
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold">Verify</h1>
          <p className="text-gray-600 text-[15px] leading-relaxed">
            Code has been sent to <span className="font-medium text-black">{email || "your email"}</span>.<br />
            Enter the code to retrieve your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-20 md:w-20 md:h-24 text-2xl text-center border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors disabled:bg-gray-50"
              />
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-gray-300 text-sm">
              Didn't receive a code?{' '}
              <button 
                type="button" 
                className={`${timer === 0 ? 'text-black font-medium hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
                disabled={timer > 0 || loading}
              >
                Resend Code
              </button>
            </p>
            <p className="text-gray-300 text-sm">
              Resend code in 00:{timer.toString().padStart(2, '0')}
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-md font-semibold text-[16px] transition-all duration-300 shadow-sm uppercase tracking-wider ${
              isFormValid && !loading
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

const VerifyPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
};

export default VerifyPage;