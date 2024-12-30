import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { MiniKitProvider } from "@/providers/MiniKitProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "MiniKit Next.js Example",
  description: "Example application using MiniKit with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${spaceGrotesk.variable} min-h-screen bg-background text-foreground antialiased`}>
        <MiniKitProvider>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </MiniKitProvider>
      </body>
    </html>
  );
}