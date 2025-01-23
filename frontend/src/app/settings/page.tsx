"use client"

import { FilledButton } from "@/components/ui/FilledButton"
import { LogOut, Moon, Bell, HelpCircle, Flag, FileText } from "lucide-react"
import { SettingsCard } from "@/components/ui/SettingsCard"
import { ToggleSwitch } from "@/components/ui/ToggleSwitch"
import { MembershipCard } from "@/components/ui/MembershipCard"
import { NotificationsToggle } from "@/components/ui/NotificationsToggle"

export default function SettingsPage() {
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
        <MembershipCard 
          expiryDate="March 15, 2024"
          isActive={true}
          cost={3}
        />

        <div className="space-y-4 mt-8">
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