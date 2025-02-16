"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";

interface SettingsCardProps {
  icon: LucideIcon;
  label: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}

export function SettingsCard({
  icon: Icon,
  label,
  rightElement,
  onClick,
}: SettingsCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-[20px] bg-brand-secondary p-4 flex items-center justify-between shadow-[0px_4px_4px_rgba(0,0,0,0.25)]",
        onClick &&
          "cursor-pointer hover:bg-brand-secondary/90 transition-colors",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="text-base font-bold text-white">
          {label}
        </span>
      </div>
      {rightElement}
    </button>
  );
}
