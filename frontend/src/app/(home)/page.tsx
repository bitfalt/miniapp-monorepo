"use client";

import { useState, useEffect } from 'react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ProfileCard } from "@/components/ui/ProfileCard";
import QuizCard from "@/components/ui/QuizCard";
import { AchievementButton } from "@/components/ui/AchievementButton"
import { LeaderboardButton } from "@/components/ui/LeaderboardButton"
import { useVerification } from '@/hooks/useVerification'
import { VerifyModal } from '@/components/ui/VerifyModal'
import { useRouter } from 'next/navigation'
import { clearVerificationSession } from '@/hooks/useVerification'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Sun } from 'lucide-react'

interface User {
  name: string;
  last_name: string;
  level: string;
  points: number;
  maxPoints: number;
}

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const { handleVerify } = useVerification()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Skip auth check if we're in the registration process
        if (window.location.pathname.includes('/register')) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/home')
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          
          // If user not found, clear session and redirect to sign-in
          if (response.status === 404) {
            console.log('User not found, redirecting to sign-in')
            clearVerificationSession()
            const logoutResponse = await fetch('/api/auth/logout', {
              method: 'POST'
            })
            if (logoutResponse.ok) {
              router.push('/sign-in')
            }
            return
          }
          return
        }
        const data = await response.json()
        console.log('Received user data:', data)
        setUserData(data.user)
        
        // Check if user is verified
        if (!data.user.verified) {
          setShowVerifyModal(true)
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleVerifyClick = async () => {
    const success = await handleVerify()
    if (success) {
      setShowVerifyModal(false)
      // Refresh user data to get updated verification status
      const response = await fetch('/api/home')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <VerifyModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerify={handleVerifyClick}
      />
      
      <div className="min-h-screen">
        <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
          
          <motion.div 
            className="relative z-10 text-center max-w-md mx-auto space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-3">
              <Sun className="h-10 w-10 mx-auto text-[#E36C59]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                Welcome Back!
              </h1>
            </div>
            
            <p className="text-slate-200 text-base sm:text-lg mb-4 max-w-sm mx-auto font-medium">
              Track your progress and continue your journey of self-discovery
            </p>
          </motion.div>
        </div>

        <motion.div 
          className="flex flex-col items-center md:p-6 pb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-7xl px-4">
            <div className="flex flex-col gap-6 items-center w-full">
              <motion.div 
                className="w-full flex justify-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <ProfileCard 
                  className={cn(
                    "w-full max-w-[365px]",
                    "transform transition-all duration-300 hover:scale-105 hover:-translate-y-1",
                    "shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]",
                    "hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]"
                  )}
                  user={userData || undefined}
                />
              </motion.div>

              <motion.div 
                className="w-full flex justify-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <LeaderboardButton />
              </motion.div>
              
              <motion.div 
                className="w-full flex justify-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <QuizCard />
              </motion.div>

              <motion.div 
                className="w-full flex justify-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <AchievementButton />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
