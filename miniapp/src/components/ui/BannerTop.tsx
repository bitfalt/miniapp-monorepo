import { cn } from "@/lib/utils"

interface BannerTopProps {
  message?: string;
  variant?: 'warning' | 'success';
  className?: string;
}

export function BannerTop({ 
  message = "Unverified",
  variant = 'warning',
  className
}: BannerTopProps) {
  return (
    <div className={cn(
      "relative w-full h-[43px] overflow-hidden",
      className
    )}>
      <div className={cn(
        "absolute inset-x-0 top-0 h-full",
        variant === 'warning' ? 'bg-accent-red' : 'bg-brand-primary'
      )} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xl font-bold font-spaceGrotesk">
          {message}
        </span>
      </div>
    </div>
  )
}
