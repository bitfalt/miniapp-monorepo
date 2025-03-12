import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  needsRegistration: boolean;
  walletAddress: string | null;
  loading: boolean;
}

// Helper function to preserve language preference
function preserveLanguagePreference(callback: () => void) {
  if (typeof window !== "undefined") {
    // Save language preference
    const languagePreference = localStorage.getItem("language");
    
    // Execute the callback
    callback();
    
    // Restore language preference
    if (languagePreference) {
      localStorage.setItem("language", languagePreference);
    }
  } else {
    callback();
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isRegistered: false,
    needsRegistration: false,
    walletAddress: null,
    loading: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth checks on auth-related pages
  const shouldSkipAuthCheck =
    pathname === "/register" ||
    pathname === "/sign-in" ||
    pathname === "/welcome";

  const checkAuth = useCallback(async () => {
    // Skip auth check on auth-related pages
    if (shouldSkipAuthCheck) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      return;
    }

    // Check if registration was just completed
    const registrationComplete = sessionStorage.getItem("registration_complete");
    if (registrationComplete && pathname === "/welcome") {
      // If we're on the welcome page and registration was just completed,
      // skip auth check to prevent redirection
      setAuthState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Save language preference before auth check
      const languagePreference = localStorage.getItem("language") || sessionStorage.getItem("language");
      
      // Also set it as a cookie for server-side access
      if (languagePreference) {
        document.cookie = `language=${languagePreference}; Path=/; Max-Age=86400; SameSite=Lax`;
      }
      
      // Add a retry mechanism for session check
      let retries = 3;
      let sessionResponse;
      
      while (retries > 0) {
        try {
          // Check session first
          sessionResponse = await fetch("/api/auth/session", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
              "X-Language-Preference": languagePreference || "en"
            },
          });
          
          // If successful, break out of the retry loop
          if (sessionResponse.ok) {
            break;
          }
          
          // If unauthorized, no need to retry
          if (sessionResponse.status === 401) {
            break;
          }
          
          // Otherwise, wait and retry
          await new Promise(resolve => setTimeout(resolve, 500));
          retries--;
        } catch (err) {
          console.error("Error checking session:", err);
          retries--;
          if (retries === 0) {
            throw err;
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Restore language preference after session check
      if (languagePreference) {
        localStorage.setItem("language", languagePreference);
        sessionStorage.setItem("language", languagePreference);
        document.cookie = `language=${languagePreference}; Path=/; Max-Age=86400; SameSite=Lax`;
      }

      if (!sessionResponse || !sessionResponse.ok) {
        if (sessionResponse && sessionResponse.status === 401) {
          preserveLanguagePreference(() => {
            setAuthState({
              isAuthenticated: false,
              isRegistered: false,
              needsRegistration: false,
              walletAddress: null,
              loading: false,
            });
            
            if (pathname !== "/sign-in") {
              router.replace("/sign-in");
            }
          });
          return;
        }
        throw new Error("Session check failed");
      }

      const sessionData = await sessionResponse.json();
      
      setAuthState({
        isAuthenticated: sessionData.isAuthenticated,
        isRegistered: sessionData.isRegistered,
        needsRegistration: sessionData.needsRegistration,
        walletAddress: sessionData.address,
        loading: false,
      });

      // Handle redirects based on auth state
      if (!sessionData.isAuthenticated && pathname !== "/sign-in") {
        preserveLanguagePreference(() => {
          router.replace("/sign-in");
        });
      } else if (sessionData.needsRegistration && pathname !== "/register") {
        router.replace("/register");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      
      preserveLanguagePreference(() => {
        if (error instanceof DOMException && error.name === "SyntaxError") {
          if (pathname !== "/sign-in" && pathname !== "/welcome") {
            router.replace("/sign-in");
          }
        }

        setAuthState({
          isAuthenticated: false,
          isRegistered: false,
          needsRegistration: false,
          walletAddress: null,
          loading: false,
        });
      });
    }
  }, [pathname, router, shouldSkipAuthCheck]);

  // Initial auth check
  useEffect(() => {
    if (!shouldSkipAuthCheck) {
      checkAuth();
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, [checkAuth, shouldSkipAuthCheck]);

  // Recheck auth when window gains focus (only on protected pages)
  useEffect(() => {
    if (shouldSkipAuthCheck) return;

    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [checkAuth, shouldSkipAuthCheck]);

  // Recheck auth periodically (only on protected pages)
  useEffect(() => {
    if (shouldSkipAuthCheck) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAuth, shouldSkipAuthCheck]);

  return {
    ...authState,
    refreshAuth: checkAuth,
  };
}
