"use client";

import { Input } from "@/components/ui/input";
import { FilledButton } from "@/components/ui/FilledButton";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES, type CountryCode } from "@/constants/countries";

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    age: "",
    country: "CR" as CountryCode,
    subscription: false
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          last_name: formData.lastName,
          email: formData.email,
          age: parseInt(formData.age),
          subscription: formData.subscription,
          wallet_address: userId,
          username: `${formData.name.toLowerCase()}_${Math.random().toString(36).slice(2, 7)}`,
          country: COUNTRIES.find(c => c.countryCode === formData.country)?.country || "Costa Rica"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/welcome?name=${formData.name}`);
      } else {
        setError(data.error || "Failed to register user");
      }
    } catch (err) {
      setError("An error occurred while registering");
      console.error(err);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
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
            <label className="text-[#232931] text-base">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#232931] text-base">Last Name</label>
            <Input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#232931] text-base">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 text-black placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#232931] text-base">Age</label>
            <select
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 px-3 w-full text-black"
            >
              <option value="" className="text-gray-500">Select age</option>
              {Array.from({ length: 120 }, (_, i) => i + 1).map((age) => (
                <option key={age} value={age} className="text-black">
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[#232931] text-base">Country</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value as CountryCode })}
              className="h-[30px] bg-[#d9d9d9] rounded-[20px] border-0 px-3 text-black"
            >
              {COUNTRIES.map(({ countryCode, country, flag }) => (
                <option key={countryCode} value={countryCode} className="text-black">
                  {flag} {country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.subscription}
              onChange={(e) => setFormData({ ...formData, subscription: e.target.checked })}
              className="w-5 h-5 rounded-full bg-[#d9d9d9]"
            />
            <label className="text-[#232931] text-base">
              I would like to receive updates and insights.
            </label>
          </div>

          <FilledButton
            variant="default"
            size="sm"
            className="w-[109px] h-9 bg-[#e36c59] mx-auto"
            type="submit"
          >
            Enter
          </FilledButton>
        </form>
      </div>
    </div>
  );
} 