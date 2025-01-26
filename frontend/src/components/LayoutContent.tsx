"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { BannerTop } from "@/components/ui/BannerTop";
import MobileBottomNav from "@/components/BottomNav";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  
  const isSignInPage = pathname === "/sign-in";
  const isRegisterPage = pathname === "/register";
  const isWelcomePage = pathname === "/welcome";
  
  const showBanner = isAuthenticated && 
    !isSignInPage && 
    !isRegisterPage && 
    !isWelcomePage;
    
  const showNav = isAuthenticated && 
    !isSignInPage && 
    !isRegisterPage && 
    !isWelcomePage;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      {showBanner && <BannerTop message="Unverified Account" variant="warning" />}
      <div className={`flex-grow ${showNav ? 'pb-16' : ''}`}>
        {children}
      </div>
      {showNav && <MobileBottomNav />}
    </div>
  );
}
