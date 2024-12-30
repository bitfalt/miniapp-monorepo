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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className={`${spaceGrotesk.className} min-h-screen bg-background text-foreground antialiased`}>
        <MiniKitProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </MiniKitProvider>
      </body>
    </html>
  );
}