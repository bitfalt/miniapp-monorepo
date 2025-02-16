import type * as React from "react";

import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingOverlay() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-tertiary/90 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-4">
				<LoadingSpinner />
			</div>
		</div>
	);
}
