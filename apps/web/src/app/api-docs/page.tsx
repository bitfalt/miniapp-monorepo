"use client";

import { LoadingSpinner } from "@/components/ui/feedback/LoadingSpinner";
import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerSpec {
	openapi: string;
	info: {
		title: string;
		version: string;
		description?: string;
	};
	paths: Record<string, unknown>;
	components?: Record<string, unknown>;
	tags?: Array<{
		name: string;
		description?: string;
	}>;
}

export default function ApiDocs() {
	const [spec, setSpec] = useState<SwaggerSpec | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchDocs() {
			try {
				const response = await fetch("/api/docs");
				if (!response.ok) {
					throw new Error("Failed to fetch API documentation");
				}
				const data = await response.json();
				setSpec(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			}
		}

		void fetchDocs();
	}, []);

	if (error) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<p className="text-red-500">{error}</p>
			</div>
		);
	}

	if (!spec) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="p-4">
			<SwaggerUI spec={spec} />
		</div>
	);
}
