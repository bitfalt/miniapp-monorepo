"use client";

import type * as React from "react";

interface AchievementCardProps {
	title?: string;
	description?: string;
	date?: string;
}

export function AchievementCard({
	title = "Ideology Explorer",
	description = "Completed the Ideology Test",
	date = "[date]",
}: AchievementCardProps) {
	return (
		<article className="flex w-full max-w-md items-center gap-8 rounded-3xl bg-white p-6 shadow-md">
			<div className="relative flex-shrink-0" aria-hidden="true">
				<div
					className="h-20 w-20 rounded-full"
					style={{ backgroundColor: "#55BCB3" }}
				>
					<div
						className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
						style={{ backgroundColor: "#2D3436" }}
					>
						<div
							className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{ backgroundColor: "#FF7675" }}
						/>
					</div>
				</div>
			</div>
			<div className="space-y-1">
				<h3 className="text-xl font-semibold text-gray-900">{title}</h3>
				<p className="text-sm text-gray-600">{description}</p>
				<p className="text-xs text-gray-500">Obtained on {date}</p>
			</div>
		</article>
	);
}
