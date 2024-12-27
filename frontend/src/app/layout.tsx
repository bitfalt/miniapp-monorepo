import { Metadata } from "next";
import { MiniKitProvider } from "@/providers/MiniKitProvider";
import { ErudaProvider } from "@/components/Eruda";
import "./globals.css";

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
    <html lang="en">
      <body>
        <ErudaProvider>
          <MiniKitProvider>{children}</MiniKitProvider>
        </ErudaProvider>
      </body>
    </html>
  );
}