import "@/app/globals.css";

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Space_Grotesk } from "next/font/google";
import type * as React from "react";

import { LayoutContent } from "@/components/LayoutContent";
import { MiniKitProvider } from "@/providers/MiniKitProvider";
import { NotificationsProvider } from "@/providers/NotificationsProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const ErudaProvider = dynamic(
  () =>
    import("@/providers/eruda-provider").then((mod) => ({
      default: ({ children }: { children: React.ReactNode }) => (
        <mod.Eruda>{children}</mod.Eruda>
      ),
    })),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "MindVault",
  description: "Your journey toward understanding your true self begins here.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} bg-neutral-bg text-foreground antialiased`}
      >
        <ThemeProvider>
          <NotificationsProvider>
            <ErudaProvider>
              <MiniKitProvider>
                <LayoutContent>{children}</LayoutContent>
              </MiniKitProvider>
            </ErudaProvider>
          </NotificationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
