"use client";

import { FilledButton } from "@/components/ui/FilledButton";
import { cn } from "@/lib/utils";
import { Flame, LockIcon } from "lucide-react";
import type * as React from "react";

export function QuizCard() {
	return (
		<div
			className={cn(
				"mx-auto h-[180px] w-[280px] relative overflow-hidden flex flex-col rounded-[16px] bg-gradient-to-br from-[#DA9540] via-[#E5AB5C] to-[#F1C17A]",
				"transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 sm:w-[320px]",
				"shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]",
				"hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]",
				"transition-all duration-300",
			)}
		>

			<div className="relative z-10 flex h-full flex-col justify-between p-4">
				<div className="mb-3 text-center font-spaceGrotesk text-base font-medium leading-tight text-white sm:text-lg">
					<div className="flex items-center justify-center gap-2 mb-1">
						<span>Daily Streaks</span>
					</div>
					Build your learning path
				</div>
				<div className="space-y-3">
					<div className="w-full rounded-[12px] bg-white/20 p-2 backdrop-blur-md">
						<div className="flex items-center justify-between">
							<div className="ml-2 font-spaceGrotesk text-xs font-medium leading-tight text-white sm:text-sm">
								DAILY CHALLENGES
							</div>
							<Flame
								className="h-5 w-5 text-accent-red animate-pulse"
								aria-hidden="true"
							/>
						</div>
					</div>
					<FilledButton
						variant="default"
						size="sm"
						icon={LockIcon}
						className="h-10 w-full transform text-sm transition-all duration-300 cursor-not-allowed opacity-80"
						disabled
					>
						Coming Soon
					</FilledButton>
				</div>
			</div>
		</div>
	);
}
