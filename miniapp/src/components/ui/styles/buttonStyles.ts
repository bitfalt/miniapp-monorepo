export const buttonSizes = {
  sm: 'h-8 px-4 text-sm',
  md: 'h-10 px-6 text-base',
  lg: 'h-12 px-8 text-lg'
} as const

export const buttonVariants = {
  default: 'bg-accent-red hover:bg-accent-redSoft',
  success: 'bg-brand-primary hover:bg-brand-secondary',
  warning: 'bg-accent-orange hover:bg-accent-orange/90'
} as const

export type ButtonSize = keyof typeof buttonSizes
export type ButtonVariant = keyof typeof buttonVariants 