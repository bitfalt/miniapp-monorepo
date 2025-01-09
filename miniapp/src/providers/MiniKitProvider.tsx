"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // @ts-expect-error - MiniKit.install accepts config object but types are incorrect
    MiniKit.install({
      styleIsolation: true,
      enableTelemetry: false
    });
  }, []);

  return (
    <div className="relative isolate">
      {children}
    </div>
  );
}; 