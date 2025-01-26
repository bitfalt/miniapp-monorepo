"use client";

import { useState, useEffect } from 'react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ProfileCard } from "@/components/ui/ProfileCard";
import QuizCard from "@/components/ui/QuizCard";
import { AchievementButton } from "@/components/ui/AchievementButton"
import { LeaderboardButton } from "@/components/ui/LeaderboardButton"

interface User {
  name: string;
  last_name: string;
  level: string;
  points: number;
  maxPoints: number;
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/home')
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          return
        }
        const data = await response.json()
        console.log('Received user data:', data)  // Debug log
        setUserData(data.user)
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-slate-200 text-lg mb-4 max-w-sm mx-auto font-medium">
            Track your progress and continue your journey of self-discovery
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center md:p-6">
        <div className="w-full max-w-7xl px-4">
          <div className="flex flex-col gap-6 items-center w-full">
            <div className="w-full flex justify-center">
              <ProfileCard 
                className="w-full max-w-[365px] transform transition-all duration-300 hover:scale-105" 
                user={userData || undefined}
              />
            </div>

            <div className="w-full flex justify-center">
              <LeaderboardButton />
            </div>
            
            <div className="w-full flex justify-center">
              <QuizCard />
            </div>

            <div className="w-full flex justify-center">
              <AchievementButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
