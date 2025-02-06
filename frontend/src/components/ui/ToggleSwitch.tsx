"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";
import type * as React from "react";

export function ToggleSwitch() {
  const { theme, toggleTheme } = useTheme();
  const checked = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggleTheme}
      className={cn(
        "h-6 w-12 rounded-full transition-colors duration-200",
        checked ? "bg-accent-red" : "bg-neutral-grey",
      )}
    >
      <span
        className={cn(
          "block h-[18px] w-5 rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
