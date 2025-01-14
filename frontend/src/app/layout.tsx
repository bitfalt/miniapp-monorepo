import { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import dynamic from "next/dynamic";
import MiniKitProvider from "@/providers/MiniKitProvider";
import NextAuthProvider from "@/providers/next-auth-provider";
import MobileBottomNav from "@/components/BottomNav";
import { getServerSession } from "next-auth";
import { headers } from 'next/headers';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const ErudaProvider = dynamic(
  () => import("@/providers/eruda-provider").then((mod) => ({ 
    default: ({ children }: { children: React.ReactNode }) => <mod.Eruda>{children}</mod.Eruda>
  })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "MiniKit Next.js Example",
  description: "Example application using MiniKit with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isSignInPage = pathname === "/sign-in";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${spaceGrotesk.variable} min-h-screen bg-neutral-bg text-foreground antialiased overflow-x-hidden`}>
        <NextAuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              <main className={`min-h-screen w-full ${session && !isSignInPage ? 'pb-16' : ''}`}>
                {children}
              </main>
              {session && !isSignInPage && <MobileBottomNav />}
            </MiniKitProvider>
          </ErudaProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}