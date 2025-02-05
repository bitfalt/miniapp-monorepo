"use client";

import dynamic from "next/dynamic";
import type * as React from "react";

interface ErudaProviderProps {
  children: React.ReactNode;
}

const Eruda = dynamic(() => import("./eruda-provider").then((c) => c.Eruda), {
  ssr: false,
});

export function ErudaProvider({ children }: ErudaProviderProps) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return children;
  }
  return <Eruda>{children}</Eruda>;
}
