"use client";

import { BookCheck, Home, Lightbulb, Settings, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { useEffect, useState } from "react";

const navItems = [
	{ icon: Home, href: "/" },
	{ icon: BookCheck, href: "/test-selection" },
	{ icon: Lightbulb, href: "/results" },
	{ icon: Trophy, href: "/achievements" },
	{ icon: Settings, href: "/settings" },
] as const;

export function BottomNav() {
	const pathname = usePathname();
	const [active, setActive] = useState(0);

	useEffect(() => {
		const currentIndex = navItems.findIndex((item) => item.href === pathname);
		if (currentIndex !== -1) {
			setActive(currentIndex);
		}
	}, [pathname]);

	if (pathname.includes("/ideology-test")) {
		return null;
	}

	return (
		<nav className="fixed bottom-4 left-4 right-4 h-16 rounded-[25px] bg-brand-tertiary shadow-lg">
			<div className="flex h-full items-center justify-around px-4">
				{navItems.map(({ icon: Icon, href }, index) => (
					<Link
						key={href}
						href={href}
						className={`flex h-12 w-12 items-center justify-center ${
							active === index ? "text-accent-red" : "text-gray-100"
						}`}
					>
						<div
							className={`rounded-full p-2 ${
								active === index ? "bg-accent-red/10" : ""
							}`}
						>
							<Icon
								size={24}
								className={`transition-all duration-300 ${
									active === index ? "scale-110" : ""
								}`}
								aria-hidden="true"
							/>
						</div>
					</Link>
				))}
			</div>
		</nav>
	);
}
