"use client";

import { FilledButton } from "@/components/ui/FilledButton";
import { cn } from "@/lib/utils";
import { ArrowRight, ClockIcon } from "lucide-react";
import type * as React from "react";

export function QuizCard() {
	return (
		<div
			className={cn(
				"mx-auto h-[160px] w-[280px] relative overflow-hidden flex flex-col rounded-[16px] bg-gradient-to-br from-[#DA9540] via-[#E5AB5C] to-[#F1C17A]",
				"transform hover:scale-105 hover:-translate-y-1 hover:rotate-1 sm:w-[320px]",
				"shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]",
				"hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]",
				"transition-all duration-300",
			)}
		>
			<div className="relative z-10 flex h-full flex-col justify-between p-4">
				<div className="mb-3 text-center font-spaceGrotesk text-base font-medium leading-tight text-white sm:text-lg">
					Keep your streak alive! <br />
					Complete a quiz today
				</div>
				<div className="space-y-3">
					<div className="w-full rounded-[12px] bg-white/20 p-2 backdrop-blur-md">
						<div className="flex items-center justify-between">
							<div className="ml-2 font-spaceGrotesk text-xs font-medium leading-tight text-white sm:text-sm">
								DAILY QUESTIONNAIRE
							</div>
							<ClockIcon
								className="h-5 w-5 animate-pulse text-accent-red"
								aria-hidden="true"
							/>
						</div>
					</div>
					<FilledButton
						variant="default"
						size="sm"
						icon={ArrowRight}
						className="h-8 w-full transform text-xs transition-all duration-300 hover:scale-105"
					>
						Start Quiz
					</FilledButton>
				</div>
			</div>
		</div>
	);
}
