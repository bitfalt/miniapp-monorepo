"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type * as React from "react";
import { useMemo } from "react";

interface ProgressBarProps {
	progress?: number;
	className?: string;
	variant?: "default" | "success" | "warning";
}

export function ProgressBar({
	progress = 0,
	className = "",
	variant = "default",
}: ProgressBarProps) {
	const progressBarColors = {
		default: "bg-accent-red",
		success: "bg-brand-primary",
		warning: "bg-accent-orange",
	};

	// Calculate diamond positions based on total questions
	const diamondPositions = useMemo(() => {
		const positions = [
			{ id: "first-third", pixelPosition: 56 },
			{ id: "second-third", pixelPosition: 168 },
			{ id: "final-third", pixelPosition: 281 },
		];

		return positions;
	}, []);

	return (
		<div
			className={cn("relative h-[21px] w-[337px]", className)}
			role="progressbar"
			aria-valuenow={progress}
			aria-valuemin={0}
			aria-valuemax={100}
			tabIndex={0}
		>
			<div className="absolute left-0 top-[4px] h-[12px] w-full rounded-[15px] bg-neutral-bg shadow-[0px_4px_4px_rgba(0,0,0,0.25)]" />

			<motion.div
				className={cn(
					"absolute left-0 top-[4px] h-[12px] rounded-[15px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
					progressBarColors[variant],
				)}
				style={{
					width: `${progress}%`,
				}}
				initial={{ width: 0 }}
				animate={{ width: `${progress}%` }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			/>

			{diamondPositions.map(({ id, pixelPosition }) => {
				// Calculate if the progress bar has reached this diamond's center
				const progressInPixels = (progress / 100) * 337;
				const isActive = progressInPixels >= pixelPosition;
				const shouldAnimate =
					isActive && !sessionStorage.getItem(`diamond-${id}-animated`);

				if (shouldAnimate) {
					sessionStorage.setItem(`diamond-${id}-animated`, "true");
				}

				return (
					<motion.div
						key={id}
						className="absolute h-5 w-5"
						style={{
							left: `${pixelPosition}px`,
							top: "0px",
							transform: "translateX(-50%)",
							transformOrigin: "center",
						}}
						animate={
							shouldAnimate
								? {
										scale: [1, 1.3, 1],
										rotate: [0, 180, 360],
										filter: [
											"brightness(1)",
											"brightness(1.8)",
											"brightness(1.2)",
										],
									}
								: {}
						}
						transition={{
							duration: 0.7,
							ease: "easeOut",
							times: [0, 0.5, 1],
						}}
					>
						<svg
							className={cn(
								"h-full w-full transition-colors duration-300",
								isActive ? "text-brand-primary" : "text-neutral-bg/50",
							)}
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
							role="presentation"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M12 2.005c-.777 0 -1.508 .367 -1.971 .99l-5.362 6.895c-.89 1.136 -.89 3.083 0 4.227l5.375 6.911a2.457 2.457 0 0 0 3.93 -.017l5.361 -6.894c.89 -1.136 .89 -3.083 0 -4.227l-5.375 -6.911a2.446 2.446 0 0 0 -1.958 -.974z" />
						</svg>
					</motion.div>
				);
			})}
		</div>
	);
}
