"use client";

import eruda from "eruda";
import type * as React from "react";
import { useEffect } from "react";

interface ErudaProps {
  children: React.ReactNode;
}

function Eruda({ children }: ErudaProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === "true") {
      try {
        eruda.init();
      } catch {
        // Silently fail if Eruda initialization fails
      }
    }
  }, []);

  return <>{children}</>;
}

export default Eruda;

// Export a type-safe component for dynamic import
export type ErudaComponent = typeof Eruda;
