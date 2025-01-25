"use client";

import { ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
        throw new Error('NEXT_PUBLIC_WLD_APP_ID is not defined');
      }
      MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID);
    } catch (error) {
      console.error('Failed to initialize MiniKit:', error);
    }
  }, []);

  return (
    <div className="relative isolate">
      {children}
    </div>
  );
} 