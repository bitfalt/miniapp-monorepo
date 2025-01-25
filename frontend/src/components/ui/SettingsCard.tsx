import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsCardProps {
  icon: LucideIcon
  label: string
  rightElement?: React.ReactNode
  onClick?: () => void
}

export function SettingsCard({ icon: Icon, label, rightElement, onClick }: SettingsCardProps) {
  return (
    <div
      className={cn(
        "w-full bg-brand-secondary rounded-[20px] p-4 flex items-center justify-between",
        "shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
        onClick && "cursor-pointer hover:bg-brand-secondary/90 transition-colors"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-white" />
        <span className="text-white text-base font-bold font-spaceGrotesk">
          {label}
        </span>
      </div>
      {rightElement}
    </div>
  )
} 