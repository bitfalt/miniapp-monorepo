"use client";

import { Search, X } from "lucide-react";
import type * as React from "react";
import { forwardRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { useTranslation } from "@/i18n";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-full border border-teal-600 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

interface SearchBarProps {
	onSearch: (query: string) => void;
	className?: string;
	placeholder?: string;
}

export function SearchBar({
	onSearch,
	className,
	placeholder,
}: SearchBarProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const { t } = useTranslation();

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleSearch = () => {
		onSearch(searchQuery);
	};

	const handleClear = () => {
		setSearchQuery("");
		onSearch("");
	};

	return (
		<div className={cn("relative w-full max-w-md", className)}>
			<Input
				type="text"
				placeholder={placeholder || t('common.search')}
				value={searchQuery}
				onChange={handleInputChange}
				className="h-12 w-full rounded-full border-0 bg-white pl-4 pr-12 text-lg font-bold text-gray-600 placeholder:text-gray-400"
			/>
			<div className="absolute right-2 top-2 flex items-center space-x-2">
				<button
					type="button"
					onClick={handleClear}
					className="flex h-8 items-center justify-center rounded-full bg-gray-200 px-2 text-gray-600 transition-colors duration-200 hover:bg-gray-300"
					aria-label={t('common.clear')}
				>
					<X className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={handleSearch}
					className="flex h-8 items-center justify-center rounded-full bg-teal-600 px-4 text-white shadow-md transition-shadow duration-200 hover:shadow-lg"
					aria-label={t('common.search')}
				>
					<Search className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
