"use client";

import type * as React from "react";

interface Achievement {
	id: string;
	title: string;
	description: string;
}

interface TestCardProps {
	totalQuestions: number;
	answeredQuestions: number;
	achievements: Achievement[];
	onCardClick: () => void;
	title: string;
}

export function TestCard({
	totalQuestions,
	answeredQuestions,
	achievements,
	onCardClick,
	title,
}: TestCardProps) {
	const progress = Math.round((answeredQuestions / totalQuestions) * 100);

	return (
		<button
			type="button"
			className="w-full max-w-sm transform cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br from-[#387478] to-[#2C5154] text-white shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:rotate-1 hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]"
			onClick={onCardClick}
		>
			<div className="absolute inset-0 transform rounded-3xl bg-black opacity-20 blur-md translate-y-2" />
			<div className="relative z-10">
				<div className="relative p-6">
					<h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
						{title}
					</h2>
					<div className="space-y-4">
						<div className="space-y-2">
							<div className="flex justify-between text-sm font-medium">
								<span>Progress</span>
								<span className="font-bold text-[#E36C59]">{progress}%</span>
							</div>
							<div
								className="relative h-2 overflow-hidden rounded-full bg-white/20"
								aria-label={`${progress}% of test completed`}
							>
								<div
									className="absolute left-0 top-0 h-full bg-[#E36C59] transition-all duration-300 ease-in-out"
									style={{ width: `${progress}%` }}
								>
									<div className="absolute right-0 top-0 bottom-0 w-2 rounded-full bg-white/30" />
								</div>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm font-medium">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-[#E36C59]"
									aria-hidden="true"
								>
									<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
									<path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
									<path d="M4 22h16" />
									<path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
									<path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
									<path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
								</svg>
								<span>Achievements</span>
							</div>
							<div className="flex gap-2">
								{achievements.map((achievement) => (
									<div
										key={achievement.id}
										className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110"
										title={`${achievement.title} - ${achievement.description}`}
										role="img"
										aria-label={`${achievement.title} achievement - ${achievement.description}`}
									>
										<span className="text-xs font-bold">
											{achievement.title.charAt(0)}
										</span>
										<span className="sr-only">{achievement.title}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</button>
	);
}
