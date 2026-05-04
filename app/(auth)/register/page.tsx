"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, UserRole } from '@/features/auth/services/authservices';

const ROLE_FIELDS = {
  'Entertainer': [
    { label: 'Full Name', name: 'fullName', placeholder: 'Enter your full name' },
    { label: 'Stage Name', name: 'stageName', placeholder: 'Enter your stage name' },
    { label: 'Email', name: 'email', placeholder: 'Enter your email' },
    { label: 'Phone Number', name: 'phoneNumber', placeholder: 'Enter your phone number' },
  ],
  'Event Organizer': [
    { label: 'Business Name', name: 'businessName', placeholder: 'Enter your business name' },
    { label: 'Name', name: 'name', placeholder: 'Enter your name' },
    { label: 'Email', name: 'email', placeholder: 'Enter your email' },
    { label: 'Phone Number', name: 'phoneNumber', placeholder: 'Enter your phone number' },
  ]
};

const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<UserRole>('Entertainer');
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '', stageName: '', businessName: '', name: '',
        email: '', phoneNumber: '', password: '',
    });

    const currentFields = ROLE_FIELDS[userType];

    const isFormValid = currentFields.every(f => formData[f.name as keyof typeof formData]?.trim() !== '') 
                        && formData.password.trim() !== '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Create a payload that matches the backend requirements
        const payload = {
            stageName: formData.stageName,
            businessName: formData.businessName,
            email: formData.email,
            password: formData.password,
            name: formData.fullName || formData.name, // Use fullName if it exists, else name
            phone: formData.phoneNumber               // Backend expects "phone", not "phoneNumber"
        };

        // PASS the cleaned 'payload' instead of the raw 'formData'
        const result = await authService.sendRegistrationOtp(userType, payload);
        
        console.log("Registration initiated:", result);
        router.push(`/verify?email=${encodeURIComponent(formData.email)}&role=${encodeURIComponent(userType)}`);
    } catch (err: any) {
        console.error("Fetch Error:", err.message);
        alert(err.message || "Something went wrong.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4 font-sans text-black">
            <div className="w-full max-w-105 space-y-7 bg-white">
                
                {/* Role Selection */}
                <div className="flex justify-center space-x-12 mb-4">
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    {currentFields.map((field) => (
                        <div key={field.name} className="space-y-2.5">
                            <label className="text-[15px] font-medium">{field.label}</label>
                            <input
                                type="text"
                                name={field.name}
                                placeholder={field.placeholder}
                                className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                                onChange={handleChange}
                                value={formData[field.name as keyof typeof formData]}
                            />
                        </div>
                    ))}

                    <div className="space-y-2.5 relative">
                        <label className="text-[15px] font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                className="w-full bg-white px-4 py-3.5 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
                                onChange={handleChange}
                                value={formData.password}
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

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full py-4 rounded-md font-semibold ${isFormValid && !loading ? "bg-black text-white" : "bg-[#E0E0E0] text-gray-400 cursor-not-allowed"}`}
                    >
                        {loading ? "Sending OTP..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-[14px] text-gray-500 pt-2 pb-4">
                    Already have an account? <Link href="/login" className="text-black font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;