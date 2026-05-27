"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, UserRole } from '@/features/auth/services/authservices';
import { useAuthStore } from '@/features/auth/store/authstore';
import { authUtils } from '@/features/auth/services/authUtils';

const LoginPage = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>('Entertainer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);

    try {
        // 1. Perform login
        const data = await authService.login(userType, formData);

        const token = data.token || data.accessToken;
        const user = data.user || data.data || null;

        if (!token) {
          throw new Error('Login succeeded, but no auth token was returned.');
        }

        // 2. Save to Zustand Store
        setAuth(user, token);

        // --- SAVE THE ROLE SO GATEWAY CAN READ IT ---
        authUtils.setRole(userType); 
        // ------------------------------------------------

        // 3. Redirect to the Gateway
        router.push('/dashboard'); 
    } catch (err: any) {
        alert(err.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-black">
      <div className="w-full max-w-100 space-y-8 bg-white">
        
        {/* Role Selection */}
        <div className="flex justify-start space-x-10 mb-4 ml-1">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <label className="text-[15px] font-medium text-black">Email</label>
            <input
              type="email"
              name="email"
              disabled={loading}
              placeholder="Enter your email / phone number"
              className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 text-black transition-colors disabled:bg-gray-50"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2.5 relative">
            <label className="text-[15px] font-medium text-black">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                disabled={loading}
                placeholder="Enter your password"
                className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder:text-gray-300 text-black transition-colors disabled:bg-gray-50"
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="-mt-2">
            <Link href="/forgot_password" className="text-[13px] text-gray-400 hover:text-black underline underline-offset-2 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-4 rounded-md font-semibold text-[16px] transition-all duration-300 mt-4 shadow-sm ${
              isFormValid && !loading
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-[14px] text-gray-500 pt-2">
          Don&apos;t have an account? <Link href="/register" className="text-black font-semibold hover:underline transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
