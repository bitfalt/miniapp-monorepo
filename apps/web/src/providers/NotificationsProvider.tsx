"use client";

import type * as React from "react";
import { createContext, useContext, useState } from "react";

interface NotificationsContextType {
	notificationsEnabled: boolean;
	toggleNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
	notificationsEnabled: true,
	toggleNotifications: () => undefined,
});

interface NotificationsProviderProps {
	children: React.ReactNode;
}

export function NotificationsProvider({
	children,
}: NotificationsProviderProps) {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);

	const toggleNotifications = () => {
		setNotificationsEnabled((prev) => !prev);
	};

	return (
		<NotificationsContext.Provider
			value={{ notificationsEnabled, toggleNotifications }}
		>
			{children}
		</NotificationsContext.Provider>
	);
}

export function useNotifications() {
	return useContext(NotificationsContext);
}
