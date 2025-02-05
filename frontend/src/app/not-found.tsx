"use client";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#2C5154] p-4">
			<div className="w-full max-w-md space-y-6 text-center">
				<div
					className="animate-in fade-in slide-in-from-top-4 duration-700 inline-block rounded-full border
            border-white/10 bg-[#2C5154]/40 px-6 py-2 text-white shadow-lg backdrop-blur-sm"
					aria-label="Error Badge"
				>
					<div className="flex items-center gap-2">
						<svg
							className="h-5 w-5 text-[#E36C59]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						Error 404
					</div>
				</div>

				<div
					className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 rounded-3xl
            border border-white/10 bg-[#2C5154]/40 p-8 shadow-xl backdrop-blur-sm"
				>
					<div className="space-y-6">
						<div className="flex justify-center">
							<svg
								className="h-24 w-24 animate-pulse text-[#E36C59]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>

						<h1 className="text-4xl font-bold tracking-tight text-white">
							Page Not Found
						</h1>

						<p className="mx-auto max-w-sm text-lg text-white/80">
							Oops! This page has embarked on an unexpected adventure.
							Let&apos;s help you find your way back!
						</p>

						<button
							type="button"
							onClick={() => {
								window.location.href = "/";
							}}
							className="mx-auto flex h-auto items-center gap-2 rounded-xl bg-[#E36C59] px-8 py-4 
                font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#E36C59]/90"
							aria-label="Go to Home"
						>
							<svg
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Go to Home
						</button>
					</div>
				</div>

				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-[#E36C59]/5 blur-3xl" />
					<div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-[#E36C59]/5 blur-3xl" />
				</div>
			</div>
		</div>
	);
}
