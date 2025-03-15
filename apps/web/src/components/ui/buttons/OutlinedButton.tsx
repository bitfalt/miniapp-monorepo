"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { ButtonSize, ButtonVariant } from "./styles/buttonStyles";
import {
	outlinedButtonSizes,
	outlinedButtonVariants,
} from "./styles/outlinedButtonStyles";

interface OutlinedButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	size?: ButtonSize;
	variant?: ButtonVariant;
	fullWidth?: boolean;
	icon?: LucideIcon;
	iconClassName?: string;
	className?: string;
	children: React.ReactNode;
}

export function OutlinedButton({
	size = "md",
	variant = "primary",
	fullWidth = false,
	icon: Icon,
	iconClassName,
	className,
	children,
	...props
}: OutlinedButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"relative flex items-center justify-center gap-2 rounded-[20px] font-semibold",
				"shadow-sm",
				"transition-all duration-300",
				"transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] active:shadow-inner",
				"focus:outline-none focus:ring-2 focus:ring-opacity-50",
				"disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:active:scale-100",
				"relative overflow-hidden group",
				"tap-highlight-transparent", // Removes tap highlight on mobile
				outlinedButtonSizes[size],
				outlinedButtonVariants[variant],
				fullWidth && "w-full",
				className,
			)}
			{...props}
		>
			<span className="absolute inset-0 w-full h-full bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300"></span>
			{children}
			{Icon && (
				<Icon
					className={cn(
						"h-4 w-4 transition-transform group-hover:scale-110 group-active:scale-95",
						size === "lg" && "h-5 w-5",
						size === "sm" && "h-3.5 w-3.5",
						iconClassName,
					)}
				/>
			)}
		</button>
	);
}
