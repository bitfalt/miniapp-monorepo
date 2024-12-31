import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FilledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning'
  fullWidth?: boolean
  icon?: LucideIcon
  iconClassName?: string
  children: React.ReactNode
}

export function FilledButton({
  size = 'md',
  variant = 'default',
  fullWidth = false,
  icon: Icon,
  iconClassName,
  className,
  children,
  ...props
}: FilledButtonProps) {
  const sizeStyles = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-10 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  }

  const variantStyles = {
    default: 'bg-accent-red hover:bg-accent-redSoft',
    success: 'bg-brand-primary hover:bg-brand-secondary',
    warning: 'bg-accent-orange hover:bg-accent-orange/90'
  }

  return (
    <button
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-[20px] font-semibold text-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors",
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
      {Icon && (
        <Icon 
          className={cn(
            "h-4 w-4",
            size === 'lg' && "h-5 w-5",
            size === 'sm' && "h-3.5 w-3.5",
            iconClassName
          )} 
        />
      )}
    </button>
  )
}
