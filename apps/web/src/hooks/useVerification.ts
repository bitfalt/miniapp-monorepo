"use client";

import type { ISuccessResult, VerifyCommandInput } from "@worldcoin/minikit-js";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Utility function to clear verification session data
export function clearVerificationSession() {
  if (typeof window !== "undefined") {
    // Save language preference
    const languagePreference = localStorage.getItem("language");
    
    // Clear session storage except for language-related items
    const keysToKeep = ['language'];
    Object.keys(sessionStorage).forEach(key => {
      if (!keysToKeep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear cookies via API instead of directly manipulating document.cookie
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(err => {
      console.error("Error clearing cookies:", err);
      
      // Fallback: try to clear cookies directly if API call fails
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=${window.location.hostname}`;
        document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      }
    });
    
    // Restore language preference if it existed
    if (languagePreference) {
      localStorage.setItem("language", languagePreference);
    }
  }
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

export function useVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);
  const router = useRouter();

  const clearVerificationSession = useCallback(() => {
    // Save language preference before clearing session
    const languagePreference = localStorage.getItem("language");
    
    setIsVerified(false);
    setIsVerifying(false);
    setError(null);
    
    // Clear cookies via API instead of directly manipulating document.cookie
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(err => {
      console.error("Error clearing cookies:", err);
      
      // Fallback: try to clear cookies directly if API call fails
      document.cookie = "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=" + window.location.hostname;
      document.cookie = "worldcoin_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=" + window.location.hostname;
      document.cookie = "siwe_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=" + window.location.hostname;
      document.cookie = "registration_status=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=" + window.location.hostname;
      
      document.cookie = "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "worldcoin_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "siwe_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "registration_status=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    });
      
    // Restore language preference after clearing session
    if (languagePreference) {
      localStorage.setItem("language", languagePreference);
    }
  }, []);

  const checkVerificationStatus = useCallback(async () => {
    setError(null);
    try {
      // Save language preference before verification check
      const languagePreference = localStorage.getItem("language");
      
      // Add a retry mechanism for session check
      let retries = 3;
      let response;
      
      while (retries > 0) {
        try {
          response = await fetch("/api/auth/session", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            },
          });
          
          // If successful, break out of the retry loop
          if (response.ok) {
            break;
          }
          
          // If unauthorized, no need to retry
          if (response.status === 401) {
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
      
      // If we still don't have a response or it failed after retries
      if (!response || !response.ok) {
        if (response && response.status === 401) {
          preserveLanguagePreference(() => {
            clearVerificationSession();
            router.push("/sign-in");
          });
          return;
        }
        throw new Error("Failed to check verification status");
      }

      const data = await response.json();
      
      // Restore language preference after successful verification check
      if (languagePreference) {
        localStorage.setItem("language", languagePreference);
      }
      
      setIsVerified(data.isVerified);

      // Handle registration and authentication states
      if (!data.isAuthenticated) {
        preserveLanguagePreference(() => {
          clearVerificationSession();
          router.push("/sign-in");
        });
        return;
      }

      if (!data.isRegistered) {
        router.push("/register");
        return;
      }
    } catch (error) {
      console.error("Error in checkVerificationStatus:", error);
      if (error instanceof DOMException) {
        preserveLanguagePreference(() => {
          clearVerificationSession();
          router.push("/sign-in");
        });
        return;
      }
      setError(
        error instanceof Error
          ? error.message
          : "Failed to check verification status",
      );
    } finally {
      setIsLoading(false);
      setHasCheckedInitial(true);
    }
  }, [router, clearVerificationSession]);

  // Initial check on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      checkVerificationStatus();
    }
  }, [checkVerificationStatus]);

  const handleVerify = async () => {
    setError(null);
    if (!MiniKit.isInstalled()) {
      setError("World App is not installed");
      window.open("https://worldcoin.org/download-app", "_blank");
      return false;
    }

    setIsVerifying(true);
    try {
      const verifyPayload: VerifyCommandInput = {
        action: "verify-user",
        verification_level: VerificationLevel.Orb,
      };

      const { finalPayload } = await MiniKit.commandsAsync
        .verify(verifyPayload)
        .catch((error) => {
          if (error instanceof DOMException) {
            throw new Error("Verification cancelled");
          }
          throw error;
        });

      if (finalPayload.status === "error") {
        console.error("World ID verification failed:", finalPayload);
        setError("Verification failed");
        return false;
      }

      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: "verify-user",
        }),
      });

      const verifyResponseJson = await verifyResponse.json();

      if (verifyResponse.ok) {
        setIsVerified(true);
        setError(null);
        await checkVerificationStatus();
        return true;
      }

      if (verifyResponse.status === 401) {
        clearVerificationSession();
        router.push("/sign-in");
      }

      setError(verifyResponseJson.error || "Verification failed");
      return false;
    } catch (error) {
      console.error("Verification error:", error);
      if (
        error instanceof Error &&
        error.message === "Verification cancelled"
      ) {
        setError("Verification was cancelled");
      } else {
        setError("Verification failed");
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerified,
    isVerifying,
    isLoading,
    error,
    hasCheckedInitial,
    handleVerify,
    checkVerificationStatus,
    refreshVerification: checkVerificationStatus,
  };
}
