import type { ButtonSize, ButtonVariant } from "./buttonStyles";

export const outlinedButtonSizes = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-5 py-2.5 text-lg",
};

export const outlinedButtonVariants = {
	default: "border border-white text-white hover:bg-white/10",
	primary:
		"border border-brand-primary text-brand-primary hover:bg-brand-primary/10",
	secondary:
		"border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/10",
	accent: "border border-accent-red text-accent-red hover:bg-accent-red/10",
	warning: "border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
};

export type OutlinedButtonSize = ButtonSize;
export type OutlinedButtonVariant = ButtonVariant;
