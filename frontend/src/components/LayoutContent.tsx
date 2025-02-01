"use client";

import { useAuth } from "@/hooks/useAuth";
import { useVerification } from "@/hooks/useVerification";
import { usePathname } from "next/navigation";
import { BannerTop } from "@/components/ui/BannerTop";
import MobileBottomNav from "@/components/BottomNav";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { BackgroundEffect } from "@/components/ui/BackgroundEffect";
import { useEffect } from "react";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isRegistered, loading: authLoading, refreshAuth } = useAuth();
  const { 
    isVerified, 
    isLoading: verificationLoading, 
    refreshVerification,
    hasCheckedInitial 
  } = useVerification();
  const pathname = usePathname();
  
  // Page checks
  const isSignInPage = pathname === "/sign-in";
  const isRegisterPage = pathname === "/register";
  const isWelcomePage = pathname === "/welcome";
  const isTestInstructions = pathname === "/tests/instructions";
  const isIdeologyTest = pathname.includes("/ideology-test");
  const isHomePage = pathname === "/";
  const isSettingsPage = pathname === "/settings";
  const isResultsPage = pathname === "/results";
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('Layout state:', {
      isAuthenticated,
      isRegistered,
      isVerified,
      authLoading,
      verificationLoading,
      hasCheckedInitial,
      pathname
    });
  }, [isAuthenticated, isRegistered, isVerified, authLoading, verificationLoading, hasCheckedInitial, pathname]);

  // Refresh both auth and verification when auth state changes
  useEffect(() => {
    // Skip auth check on auth-related pages
    if (isSignInPage || isRegisterPage || isWelcomePage) {
      return;
    }

    console.log('Auth state changed:', { isAuthenticated, isRegistered, authLoading });
    if (!authLoading) {
      if (isAuthenticated && isRegistered) {
        console.log('Refreshing verification status...');
        refreshVerification();
      } else if (!isAuthenticated) {
        console.log('Refreshing auth status...');
        refreshAuth();
      }
    }
  }, [isAuthenticated, isRegistered, authLoading, refreshVerification, refreshAuth, isSignInPage, isRegisterPage, isWelcomePage]);
  
  // Determine background effect variant based on current page
  const getBackgroundVariant = () => {
    if (isSignInPage) return 'signin';
    if (isHomePage) return 'home';
    if (isSettingsPage) return 'settings';
    if (isResultsPage) return 'results';
    return 'default';
  };

  // Don't show loading overlay on auth-related pages
  const showLoadingOverlay = !isSignInPage && !isRegisterPage && !isWelcomePage;
  
  // Show loading state while checking auth or initial verification
  if ((authLoading || (isAuthenticated && isRegistered && !hasCheckedInitial)) && showLoadingOverlay) {
    console.log('Showing loading overlay');
    return (
      <>
        <LoadingOverlay />
        <div className="flex-grow opacity-0">{children}</div>
      </>
    );
  }
  
  const showBanner = isAuthenticated && 
    isRegistered &&
    !isVerified &&
    !isSignInPage && 
    !isRegisterPage && 
    !isWelcomePage &&
    !isTestInstructions &&
    !isIdeologyTest;
    
  const showNav = isAuthenticated && 
    isRegistered &&
    !isSignInPage && 
    !isRegisterPage && 
    !isWelcomePage;

  console.log('Render state:', { showBanner, showNav });

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <BackgroundEffect variant={getBackgroundVariant()} />
      {showBanner && <BannerTop />}
      <main className="scroll-container">
        <div className={`flex-grow ${showNav ? 'pb-16' : ''}`}>
          {children}
        </div>
      </main>
      {showNav && <MobileBottomNav />}
    </div>
  );
}
