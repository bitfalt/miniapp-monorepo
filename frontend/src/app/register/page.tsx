"use client";

import { Input } from "@/components/ui/input";
import { FilledButton } from "@/components/ui/FilledButton";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES, type CountryCode } from "@/constants/countries";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    age: "",
    country: "CR" as CountryCode
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Get wallet address and username from MiniKit
      const walletAddress = MiniKit.user?.walletAddress;
      const username = MiniKit.user?.username;

      if (!walletAddress) {
        throw new Error('No wallet address provided');
      }

      // Get form data
      const userData = {
        name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        age: parseInt(formData.age),
        subscription: false,
        wallet_address: walletAddress,
        username: username,
        country: COUNTRIES.find(c => c.countryCode === formData.country)?.country || "Costa Rica"
      };

      // Client-side validation
      if (!userData.name || userData.name.length < 2 || userData.name.length > 50) {
        throw new Error('Name must be between 2 and 50 characters');
      }

      if (!userData.last_name || userData.last_name.length < 2 || userData.last_name.length > 50) {
        throw new Error('Last name must be between 2 and 50 characters');
      }

      if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!userData.age || userData.age < 18 || userData.age > 120) {
        throw new Error('Age must be between 18 and 120');
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(userData.wallet_address)) {
        throw new Error('Invalid wallet address format');
      }

      console.log('Submitting user data:', userData);

      // Create user
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();
      console.log('User creation response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user profile');
      }

      // Create session
      console.log('Creating session for user:', walletAddress);
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          walletAddress,
          isSiweVerified: true
        })
      });

      if (!sessionResponse.ok) {
        const sessionError = await sessionResponse.json();
        throw new Error(sessionError.error || 'Failed to create session');
      }

      // Set registration completion flag and redirect to welcome page
      sessionStorage.setItem('registration_complete', 'true');
      router.push('/welcome');

    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <div className="relative w-screen h-[354px] -mt-4">
        <div className="w-screen absolute top-0 bg-white rounded-b-[65px] shadow-[inset_-5px_-5px_25px_0px_rgba(134,152,183,1.00),inset_5px_5px_25px_0px_rgba(248,248,246,1.00)]" />
        <div className="w-screen h-full px-[34px] pt-[104px] pb-[70px] absolute top-0 bg-[#2c5154] rounded-b-[65px] shadow-[21px_38px_64.69999694824219px_3px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="max-w-md mx-auto">
            <h1 className="text-white text-[50px] font-medium font-spaceGrotesk leading-[50px]">
              Let&apos;s get to know a little bit about you...
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md p-4 mt-4">
        <p className="text-center text-[#232931] text-base font-normal mb-8">
          Please fill up the following spaces to begin.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mb-20">
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="text-[#232931] text-base">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="last_name" className="text-[#232931] text-base">Last Name</label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-[#232931] text-base">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="age" className="text-[#232931] text-base">Age</label>
            <select
              id="age"
              name="age"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 px-3 w-full text-black"
            >
              <option value="" className="text-gray-500">Select age</option>
              {Array.from({ length: 113 }, (_, i) => i + 18).map((age) => (
                <option key={age} value={age} className="text-black">
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-[#232931] text-base">Country</label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value as CountryCode })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 px-3 w-full text-black"
            >
              {COUNTRIES.map(({ countryCode, country, flag }) => (
                <option key={countryCode} value={countryCode} className="text-black">
                  {flag} {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <FilledButton
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Registering...
                </div>
              ) : (
                'Complete Registration'
              )}
            </FilledButton>
          </div>
        </form>
      </div>
    </div>
  );
} 