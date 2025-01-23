"use client"

import { useTheme } from "@/providers/ThemeProvider"
import { cn } from "@/lib/utils"

export function ToggleSwitch() {
  const { theme, toggleTheme } = useTheme()
  const checked = theme === "dark"

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={toggleTheme}
      className={cn(
        "w-12 h-6 rounded-full transition-colors duration-200",
        checked ? "bg-accent-red" : "bg-neutral-grey"
      )}
    >
      <span
        className={cn(
          "block w-5 h-[18px] bg-white rounded-full transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  )
} 