"use client";

import { useEffect, useState } from "react";

interface IdeologyTagProps {
  scale: number;
  className?: string;
}

function validateScale(scale: number): void {
  if (scale < 0 || scale > 100) {
    throw new RangeError("scale must be between 0 and 100");
  }
}

export function IdeologyTag({ scale, className = "" }: IdeologyTagProps) {
  validateScale(scale);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIdeology = (scale: number) => {
    if (scale >= 45 && scale <= 55) return "centrist";
    if (scale >= 35 && scale < 45) return "moderate";
    if (scale >= 25 && scale < 35) return "balanced";
    return "neutral";
  };

  const ideologyValue = getIdeology(scale);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`inline-flex rounded-full bg-emerald-400 px-4 py-1.5 text-sm font-bold text-emerald-950 shadow-md transition-shadow duration-300 hover:shadow-lg sm:text-base ${className}`}
    >
      {ideologyValue.charAt(0).toUpperCase() + ideologyValue.slice(1)}
    </div>
  );
}
