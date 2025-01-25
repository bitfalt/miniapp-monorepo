"use client"

import { useNotifications } from "@/providers/NotificationsProvider"
import { cn } from "@/lib/utils"

export function NotificationsToggle() {
  const { notificationsEnabled, toggleNotifications } = useNotifications()

  return (
    <button
      role="switch"
      aria-checked={notificationsEnabled}
      onClick={toggleNotifications}
      className={cn(
        "w-12 h-6 rounded-full transition-colors duration-200",
        notificationsEnabled ? "bg-accent-red" : "bg-neutral-grey"
      )}
    >
      <span
        className={cn(
          "block w-5 h-[18px] bg-white rounded-full transition-transform duration-200",
          notificationsEnabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
} 