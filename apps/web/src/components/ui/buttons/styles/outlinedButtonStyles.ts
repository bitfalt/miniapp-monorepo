import type { ButtonSize, ButtonVariant } from "./buttonStyles";

export const outlinedButtonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-6 text-base",
  lg: "h-12 px-8 text-lg",
};

export const outlinedButtonVariants: Record<ButtonVariant, string> = {
  primary: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  secondary: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground",
  outline: "border-2 border-input text-foreground hover:bg-accent hover:text-accent-foreground",
  ghost: "border-2 border-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
}; 