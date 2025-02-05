"use client";

import type * as React from "react";

interface InsightResultCardProps {
	title: string;
	insight: string;
	description: string;
	percentage: number;
	left_label: string;
	right_label: string;
	values: {
		left: number;
		right: number;
		label: string;
	};
}

export function InsightResultCard({
	title,
	insight,
	description,
	percentage,
	left_label,
	right_label,
}: InsightResultCardProps) {
	return (
		<article className="rounded-3xl border border-brand-tertiary/10 bg-brand-secondary p-8 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
			<h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-100">
				{title}
			</h2>
			<p className="mb-8 italic leading-relaxed text-slate-200/90">
				&ldquo;{insight}&rdquo;
			</p>

			<div className="space-y-4">
				<div className="flex justify-between text-sm font-medium text-slate-200/90">
					<span className="flex items-center gap-2">
						<span
							className="h-2 w-2 rounded-full bg-accent-red"
							aria-hidden="true"
						/>
						{left_label}
					</span>
					<span className="flex items-center gap-2">
						{right_label}
						<span
							className="h-2 w-2 rounded-full bg-accent-blue"
							aria-hidden="true"
						/>
					</span>
				</div>
				<div
					className="h-3 overflow-hidden rounded-full bg-neutral-bg/90 backdrop-blur-sm"
					role="progressbar"
					aria-valuenow={percentage}
					aria-valuemin={0}
					aria-valuemax={100}
					tabIndex={0}
				>
					<div
						className="h-full rounded-full bg-gradient-to-r from-accent-red to-accent-redSoft transition-all duration-500"
						style={{ width: `${percentage}%` }}
					/>
				</div>
				<div className="mt-6 flex justify-center">
					<div className="inline-flex rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-bold text-emerald-950 shadow-md transition-shadow duration-300 hover:shadow-lg sm:text-base">
						{description.charAt(0).toUpperCase() + description.slice(1)}
					</div>
				</div>
			</div>
		</article>
	);
}
