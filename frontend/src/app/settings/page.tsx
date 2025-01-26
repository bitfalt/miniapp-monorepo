"use client"

import { useState, useEffect } from 'react'
import { FilledButton } from "@/components/ui/FilledButton"
import { LogOut, Moon, Bell, HelpCircle, Flag, FileText, Crown } from "lucide-react"
import { SettingsCard } from "@/components/ui/SettingsCard"
import { ToggleSwitch } from "@/components/ui/ToggleSwitch"
import { MembershipCard } from "@/components/ui/MembershipCard"
import { NotificationsToggle } from "@/components/ui/NotificationsToggle"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        await response.json()
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-20 pb-16 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-12">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 font-spaceGrotesk">
            Settings
          </h1>
          <div className="inline-block bg-accent-red px-6 py-1.5 rounded-full">
            <span className="text-white text-sm font-bold font-spaceGrotesk">
              Premium Member
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        {/* Membership Section */}
        <div className="relative">
          <MembershipCard 
            expiryDate="March 15, 2024"
            isActive={true}
            cost={3}
          />
          
          {/* Upgrade Button with Enhanced Styling */}
          <div className="mt-4 relative">
            <div className="absolute -inset-3 bg-accent-red/20 blur-xl rounded-2xl animate-pulse"></div>
            <FilledButton
              variant="default"
              size="lg"
              className={cn(
                "w-full bg-accent-red hover:bg-accent-red/90",
                "transform transition-all duration-300 hover:scale-[1.02]",
                "shadow-[0_10px_20px_rgba(227,108,89,0.3)]",
                "hover:shadow-[0_14px_28px_rgba(227,108,89,0.4)]",
                "relative z-10"
              )}
              onClick={() => router.push('/awaken-pro')}
            >
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                <span>Upgrade to Awaken Pro</span>
              </div>
            </FilledButton>
            
            {/* Enhanced Promotional Text */}
            <div className="relative z-10 mt-3 mb-4 text-center py-2 px-4">
              <p className="text-sm font-medium">
                <span className="text-neutral-black">Unlock</span>
                <span className="text-accent-red"> advanced features </span>
                <span className="text-neutral-black">and</span>
                <span className="text-accent-red"> exclusive content </span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <SettingsCard
            icon={Bell}
            label="Notifications"
            rightElement={<NotificationsToggle />}
          />
          <SettingsCard
            icon={Moon}
            label="Dark Theme"
            rightElement={<ToggleSwitch />}
          />
          <SettingsCard
            icon={FileText}
            label="View Privacy Policy"
            onClick={() => {}}
          />
          <SettingsCard
            icon={HelpCircle}
            label="Help Center"
            onClick={() => {}}
          />
          <SettingsCard
            icon={Flag}
            label="Report an Issue"
            onClick={() => {}}
          />
        </div>

        <div className="mt-8 mb-20">
          <FilledButton
            variant="default"
            size="lg"
            icon={LogOut}
            className="w-full"
          >
            Log Out
          </FilledButton>
        </div>
      </div>
    </div>
  )
} 