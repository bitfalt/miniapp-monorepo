"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import type * as React from "react";
import { useEffect } from "react";

interface MiniKitProviderProps {
  children: React.ReactNode;
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  useEffect(() => {
    try {
      if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
        throw new Error("NEXT_PUBLIC_WLD_APP_ID is not defined");
      }
      MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID);
    } catch {
      // Silently fail if MiniKit initialization fails
      // The app will handle missing MiniKit functionality gracefully
    }
  }, []);

  return <div className="relative isolate">{children}</div>;
}
