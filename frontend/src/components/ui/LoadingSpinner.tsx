"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
	className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-brand-tertiary">
			<div className={cn("relative", className)}>
				<span className="loader" />
			</div>
		</div>
	);
}
