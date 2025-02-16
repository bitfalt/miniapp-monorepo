"use client";

import { cn } from "@/lib/utils";
import { useNotifications } from "@/providers/NotificationsProvider";

export function NotificationsToggle() {
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={notificationsEnabled}
      onClick={toggleNotifications}
      className={cn(
        "h-6 w-12 rounded-full transition-colors duration-200",
        notificationsEnabled ? "bg-accent-red" : "bg-neutral-grey",
      )}
    >
      <span
        className={cn(
          "block h-[18px] w-5 rounded-full bg-white transition-transform duration-200",
          notificationsEnabled ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
