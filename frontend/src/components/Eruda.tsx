"use client";
import { ReactNode, Suspense, lazy } from "react";

const Eruda = lazy(() =>
  import("eruda").then((module) => ({
    default: ({ children }: { children: ReactNode }) => {
      module.default.init();
      return <>{children}</>;
    },
  }))
);

export const ErudaProvider = (props: { children: ReactNode }) => {
  if (process.env.NODE_ENV === "production") {
    return props.children;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Eruda>{props.children}</Eruda>
    </Suspense>
  );
};