"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type * as React from "react";
import { useState } from "react";
import { FilledButton } from "./FilledButton";

interface WorldIDButtonProps {
	onClick: () => Promise<void>;
	className?: string;
}

export function WorldIDButton({ onClick, className }: WorldIDButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		setIsLoading(true);
		try {
			await onClick();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<FilledButton
			variant="primary"
			size="lg"
			className={cn(
				"relative transform bg-brand-secondary transition-all duration-300 hover:scale-[1.02] hover:bg-brand-secondary/90",
				className,
			)}
			onClick={handleClick}
			disabled={isLoading}
		>
			<div className="flex items-center gap-3">
				<div className="relative h-6 w-6">
					<Image
						src="/world-id-logo.svg"
						alt="World ID Logo"
						width={24}
						height={24}
						className={cn(
							"transition-opacity duration-300",
							isLoading ? "opacity-0" : "opacity-100",
						)}
					/>
					{isLoading && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
						</div>
					)}
				</div>
				<span className="font-bold">
					{isLoading ? "Connecting..." : "Continue with World ID"}
				</span>
			</div>
		</FilledButton>
	);
}
