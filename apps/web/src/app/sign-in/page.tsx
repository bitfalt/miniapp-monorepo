"use client";

import { FilledButton } from "@/components/ui/buttons/FilledButton";
import { MiniKit } from "@worldcoin/minikit-js";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n";

const headingConfig = {
  firstLine: {
    prefix: "Discover Your",
    words: ["Truth", "Core", "Spirit", "Soul", "Heart", "Being", "Purpose"],
  },
  secondLine: {
    prefix: "Transform Your",
    words: ["View", "Lens", "Vision", "Mind", "Path", "Light", "World"],
  },
};

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentTrueWord, setCurrentTrueWord] = useState(0);
  const [currentPerspectiveWord, setCurrentPerspectiveWord] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Clear any old session data but preserve language preference
    if (typeof window !== "undefined") {
      // Save language preference
      const languagePreference = localStorage.getItem("language");
      
      // Clear sessionStorage except for language-related items
      const keysToKeep = ['language'];
      Object.keys(sessionStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Clear cookies directly without making an API call
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        if (cookieName && cookieName !== "language") {
          document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=${window.location.hostname}`;
          document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        }
      }
      
      // Restore language preference if it existed
      if (languagePreference) {
        localStorage.setItem("language", languagePreference);
      }
    }
  }, []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentTrueWord(
        (prev) => (prev + 1) % headingConfig.firstLine.words.length,
      );
      setCurrentPerspectiveWord(
        (prev) => (prev + 1) % headingConfig.secondLine.words.length,
      );
    }, 3000);

    return () => clearInterval(wordInterval);
  }, []);

  const handleWorldIDClick = async () => {
    setIsConnecting(true);
    try {
      setError(null);
      
      // Save language preference before authentication
      const languagePreference = localStorage.getItem("language");
      console.log("Starting sign-in process with language:", languagePreference);
      
      // Store language in sessionStorage as well for redundancy
      if (languagePreference) {
        sessionStorage.setItem("language", languagePreference);
      }

      if (!MiniKit.isInstalled()) {
        console.log("MiniKit not installed, redirecting to download page");
        router.push("https://worldcoin.org/download-app");
        return;
      }

      // Clear any existing session before starting a new one
      try {
        console.log("Clearing existing session...");
        // Create a language cookie to preserve language during redirects
        if (languagePreference) {
          document.cookie = `language=${languagePreference}; Path=/; Max-Age=86400; SameSite=Lax`;
        }
        
        // Use a more robust approach to clear the session
        try {
          console.log("Attempting to logout via API...");
          const logoutResponse = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: {
              "X-Language-Preference": languagePreference || "en",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache"
            }
          });
          
          if (!logoutResponse.ok) {
            console.warn("Logout response not OK, but continuing:", await logoutResponse.text());
          } else {
            console.log("Logout successful");
          }
        } catch (logoutErr) {
          console.warn("Error during logout, but continuing:", logoutErr);
          
          // Fallback: Clear cookies directly
          console.log("Using fallback cookie clearing method");
          const cookies = document.cookie.split(";");
          for (const cookie of cookies) {
            const cookieName = cookie.split("=")[0].trim();
            if (cookieName && cookieName !== "language") {
              document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Domain=${window.location.hostname}`;
              document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
            }
          }
        }
      } catch (err) {
        console.warn("Error clearing existing session, but continuing:", err);
        // Continue with authentication despite session clearing errors
      }
      
      // Restore language preference after logout
      if (languagePreference) {
        localStorage.setItem("language", languagePreference);
      }

      console.log("Fetching nonce...");
      const nonceResponse = await fetch("/api/nonce", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "X-Language-Preference": languagePreference || "en"
        },
      });
      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.error("Nonce fetch failed:", errorText);
        throw new Error(`Failed to fetch nonce: ${errorText}`);
      }

      const { nonce } = await nonceResponse.json();
      console.log("Nonce received successfully");

      if (!nonce) {
        console.error("Invalid nonce received");
        throw new Error("Invalid nonce received");
      }

      // Restore language preference after nonce fetch
      if (languagePreference) {
        localStorage.setItem("language", languagePreference);
        sessionStorage.setItem("language", languagePreference);
      }

      // Implement a retry mechanism for wallet auth
      let finalPayload;
      let walletAuthRetryCount = 0;
      const walletAuthMaxRetries = 3; // Increased from 2 to 3
      
      console.log("Starting wallet authentication...");
      while (walletAuthRetryCount <= walletAuthMaxRetries) {
        try {
          console.log(`Wallet auth attempt ${walletAuthRetryCount + 1}/${walletAuthMaxRetries + 1}...`);
          const result = await MiniKit.commandsAsync
            .walletAuth({
              nonce,
              statement: "Sign in with your Ethereum wallet",
            })
            .catch((error: unknown) => {
              console.error(`Wallet auth attempt ${walletAuthRetryCount + 1} failed:`, error);
              
              // Handle specific error types
              if (error instanceof DOMException) {
                if (error.name === "SyntaxError") {
                  throw new Error("Invalid SIWE message format");
                }
                throw new Error("Authentication cancelled");
              }
              
              // Handle signature verification failures
              if (typeof error === 'object' && error !== null) {
                const errorObj = error as Record<string, unknown>;
                if (errorObj.message === "Signature verification failed" || 
                    (typeof errorObj.message === 'string' && errorObj.message.includes("Signature"))) {
                  throw new Error("Signature verification failed. Please try again.");
                }
                
                // Handle load failures
                if (typeof errorObj.message === 'string' && errorObj.message.includes("Load failed")) {
                  throw new Error("Connection error. Please check your internet connection and try again.");
                }
              }
              
              throw new Error("Authentication failed: " + (error instanceof Error ? error.message : String(error)));
            });
          
          finalPayload = result.finalPayload;
          console.log("Wallet auth successful");
          break; // If successful, exit the loop
        } catch (authError) {
          if (walletAuthRetryCount === walletAuthMaxRetries || 
              (authError instanceof Error && authError.message === "Authentication cancelled")) {
            // If we've exhausted retries or the user cancelled, rethrow the error
            console.error("Wallet auth failed after all retries or was cancelled:", authError);
            throw authError;
          }
          
          console.warn(`Retrying wallet auth (attempt ${walletAuthRetryCount + 1}/${walletAuthMaxRetries})...`);
          // Wait before retrying with increasing delay
          const delay = 1000 * (walletAuthRetryCount + 1);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          walletAuthRetryCount++;
        }
      }

      if (!finalPayload || finalPayload.status !== "success") {
        console.error("Wallet auth failed:", finalPayload);
        throw new Error("Authentication failed");
      }

      // Restore language preference after wallet auth
      const languagePreferenceAfterAuth = localStorage.getItem("language") || sessionStorage.getItem("language");
      if (languagePreferenceAfterAuth) {
        localStorage.setItem("language", languagePreferenceAfterAuth);
        sessionStorage.setItem("language", languagePreferenceAfterAuth);
        document.cookie = `language=${languagePreferenceAfterAuth}; Path=/; Max-Age=86400; SameSite=Lax`;
      }

      // Get the wallet address from MiniKit after successful auth
      const walletAddress = MiniKit.user?.walletAddress;
      console.log("Wallet address from MiniKit:", walletAddress);

      // Implement a retry mechanism for complete-siwe
      let siweResponse;
      let siweData;
      let siweRetryCount = 0;
      const siweMaxRetries = 3; // Increased from 2 to 3
      
      console.log("Starting SIWE verification...");
      while (siweRetryCount <= siweMaxRetries) {
        try {
          console.log(`SIWE verification attempt ${siweRetryCount + 1}/${siweMaxRetries + 1}...`);
          siweResponse = await fetch("/api/complete-siwe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "X-Language-Preference": languagePreferenceAfterAuth || "en"
            },
            credentials: "include",
            body: JSON.stringify({
              payload: finalPayload,
              nonce,
            }),
          });

          // Restore language preference after SIWE completion attempt
          if (languagePreferenceAfterAuth) {
            localStorage.setItem("language", languagePreferenceAfterAuth);
            sessionStorage.setItem("language", languagePreferenceAfterAuth);
            document.cookie = `language=${languagePreferenceAfterAuth}; Path=/; Max-Age=86400; SameSite=Lax`;
          }

          if (!siweResponse.ok) {
            const errorText = await siweResponse.text();
            let errorMessage = "Failed to complete SIWE verification";
            
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
              console.error("Error parsing error response:", e);
            }
            
            console.error(`SIWE verification attempt ${siweRetryCount + 1} failed:`, errorMessage, errorText);
            
            if (siweRetryCount === siweMaxRetries) {
              throw new Error(errorMessage);
            }
            
            // Wait before retrying with increasing delay
            const delay = 1000 * (siweRetryCount + 1);
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            siweRetryCount++;
            continue;
          }

          siweData = await siweResponse.json();
          console.log("SIWE verification response:", siweData);
          
          if (siweData.status === "error" || !siweData.isValid) {
            const errorMessage = siweData.message || "Failed to verify SIWE message";
            console.error(`SIWE verification attempt ${siweRetryCount + 1} failed:`, errorMessage);
            
            if (siweRetryCount === siweMaxRetries) {
              throw new Error(errorMessage);
            }
            
            // Wait before retrying with increasing delay
            const delay = 1000 * (siweRetryCount + 1);
            console.log(`Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            siweRetryCount++;
            continue;
          }
          
          // If we got here, the verification was successful
          console.log("SIWE verification successful");
          break;
        } catch (error) {
          console.error(`SIWE verification attempt ${siweRetryCount + 1} error:`, error);
          
          if (siweRetryCount === siweMaxRetries) {
            throw error;
          }
          
          // Wait before retrying with increasing delay
          const delay = 1000 * (siweRetryCount + 1);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          siweRetryCount++;
        }
      }

      // Get the normalized wallet address
      const userWalletAddress = (walletAddress || siweData?.address)?.toLowerCase();
      console.log("Using wallet address for user check:", userWalletAddress);

      if (!userWalletAddress) {
        console.error("No wallet address available");
        throw new Error("No wallet address available");
      }

      // Check if user exists using the API endpoint
      console.log("Checking if user exists...");
      const userCheckResponse = await fetch("/api/user/check", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "X-Language-Preference": languagePreferenceAfterAuth || "en"
        },
        body: JSON.stringify({ walletAddress: userWalletAddress }),
      });

      if (!userCheckResponse.ok) {
        const errorData = await userCheckResponse.json();
        console.error("User check failed:", errorData);
        throw new Error(errorData.error || "Failed to check user existence");
      }

      const userCheckData = await userCheckResponse.json();
      console.log("User check result:", userCheckData);

      // Restore language preference after user check
      if (languagePreferenceAfterAuth) {
        localStorage.setItem("language", languagePreferenceAfterAuth);
      }

      if (userCheckData.exists) {
        // User exists, create session and redirect to home
        try {
          console.log("Creating session...");
          const sessionResponse = await fetch("/api/auth/session", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
              "X-Language-Preference": languagePreferenceAfterAuth || "en"
            },
            credentials: "include",
            body: JSON.stringify({
              walletAddress: userWalletAddress,
              isSiweVerified: siweData.isValid,
            }),
          });

          if (!sessionResponse.ok) {
            const sessionError = await sessionResponse.json();
            console.error("Session creation failed:", sessionError);
            throw new Error(sessionError.error || "Failed to create session");
          }

          console.log("Session created successfully");
          // Add a small delay to ensure session is properly set
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Restore language preference after session creation
          if (languagePreferenceAfterAuth) {
            localStorage.setItem("language", languagePreferenceAfterAuth);
          }

          // Check if this is the user's first login
          console.log("Fetching user data...");
          const userResponse = await fetch("/api/user/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "X-Language-Preference": languagePreferenceAfterAuth || "en",
              "X-Wallet-Address": userWalletAddress
            },
          });

          if (!userResponse.ok) {
            console.error(
              "Failed to fetch user data:",
              await userResponse.text(),
            );
            // If we can't fetch user data, just redirect to home
            console.log("Redirecting to home page due to user data fetch failure");
            router.push("/");
            return;
          }

          const userData = await userResponse.json();
          console.log("User data fetched successfully");

          // Restore language preference before redirect
          if (languagePreferenceAfterAuth) {
            localStorage.setItem("language", languagePreferenceAfterAuth);
          }

          // If this is their first login (checking created_at vs updated_at)
          if (userData.createdAt === userData.updatedAt) {
            console.log("First login detected, redirecting to welcome page");
            router.push("/welcome");
          } else {
            console.log("Returning user, redirecting to home page");
            router.push("/");
          }
        } catch (error) {
          console.error("Session/User data error:", error);
          // If something goes wrong after session creation, redirect to home
          
          // Restore language preference before redirect
          if (languagePreferenceAfterAuth) {
            localStorage.setItem("language", languagePreferenceAfterAuth);
          }
          
          console.log("Redirecting to home page due to error");
          router.push("/");
        }
      } else {
        // User doesn't exist, redirect to registration
        console.log("New user, redirecting to registration page");
        
        // Restore language preference before redirect
        if (languagePreferenceAfterAuth) {
          localStorage.setItem("language", languagePreferenceAfterAuth);
        }
        
        router.push(
          `/register?userId=${encodeURIComponent(userWalletAddress)}`,
        );
      }
    } catch (error) {
      // Always restore language preference on error
      const languagePreferenceAfterError = localStorage.getItem("language") || sessionStorage.getItem("language") || "en";
      if (languagePreferenceAfterError) {
        localStorage.setItem("language", languagePreferenceAfterError);
        sessionStorage.setItem("language", languagePreferenceAfterError);
        document.cookie = `language=${languagePreferenceAfterError}; Path=/; Max-Age=86400; SameSite=Lax`;
      }
      
      if (
        error instanceof Error &&
        error.message === "Authentication cancelled"
      ) {
        console.log("Authentication was cancelled by user");
        setError(t('signIn.errors.authCancelled'));
        return;
      }

      // Log detailed error information
      console.error("WorldID auth failed:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        type: error?.constructor?.name,
        code: error instanceof DOMException ? error.code : undefined,
        name: error instanceof DOMException ? error.name : undefined,
      });

      let errorMessage = t('signIn.errors.authFailed');
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message === "Invalid SIWE message format") {
          errorMessage = t('signIn.errors.invalidSiweFormat');
        } else if (error.message.includes("Signature verification failed")) {
          errorMessage = "Signature verification failed. Please try again.";
        } else if (error.message.includes("Load failed")) {
          errorMessage = "Connection error. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        if ("message" in error) {
          errorMessage = String(error.message);
        } else if ("error" in error && typeof error.error === "object" && error.error && "message" in error.error) {
          errorMessage = String(error.error.message);
        }
      }

      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative w-full h-[510px] -mt-4 lg:h-[600px]"
      >
        <div className="w-full absolute top-0 bg-white rounded-b-[65px] shadow-[inset_-5px_-5px_25px_0px_rgba(134,152,183,1.00),inset_5px_5px_25px_0px_rgba(248,248,246,1.00)]" />
        <div className="w-full h-full px-[34px] pt-[125px] pb-[70px] absolute top-0 bg-[#2c5154] rounded-b-[65px] shadow-[21px_38px_64.69999694824219px_3px_rgba(0,0,0,0.25)] overflow-hidden lg:pt-[180px]">
          <div className="max-w-md mx-auto lg:max-w-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="relative w-16 h-16 lg:w-24 lg:h-24">
                <Image
                  src="/MindVaultLogoTransparentHD.svg"
                  alt="MindVault Logo"
                  width={96}
                  height={96}
                  className="w-full h-full"
                  priority
                />
              </div>
            </motion.div>

            <h1 className="text-white text-[clamp(3rem,9vw,3.5rem)] font-medium leading-[1] mb-8">
              {t('signIn.headings.firstLine.prefix')}{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTrueWord}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-bold inline-block text-[#e36c59]"
                >
                  {t(`signIn.headings.firstLine.words.${currentTrueWord}`)}
                </motion.span>
              </AnimatePresence>
            </h1>
            <h2 className="text-white text-[clamp(2.75rem,8vw,3.25rem)] font-medium leading-[1]">
              {t('signIn.headings.secondLine.prefix')}{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPerspectiveWord}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-bold inline-block text-[#e36c59]"
                >
                  {t(`signIn.headings.secondLine.words.${currentPerspectiveWord}`)}
                </motion.span>
              </AnimatePresence>
            </h2>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-md space-y-4 text-center mt-auto p-4"
      >
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <FilledButton
          variant="primary"
          size="lg"
          className="w-full bg-[#E36C59] hover:bg-[#E36C59]/90"
          onClick={handleWorldIDClick}
          disabled={isConnecting}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="relative w-5 h-5">
              {isConnecting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Wallet className="w-5 h-5" />
              )}
            </div>
            <span>{isConnecting ? t('signIn.connecting') : t('signIn.worldIdButton')}</span>
          </div>
        </FilledButton>

        <p className="text-sm text-muted-foreground pb-6 mt-4">
          {t('signIn.privacyNotice')}{" "}
          <a
            href="https://docs.google.com/document/d/1GXZ5ZBevKkXUVdIfgB3Mz4KsBrjuuSQZmjocx_RH3XY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('signIn.privacyPolicy')}
          </a>{" "}
          {t('signIn.and')}{" "}
          <a
            href="https://docs.google.com/document/d/1Rn1Whrf3gIaq0UGMxsSyWeheTcXNZfMRAYFhegFu3vQ/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('signIn.termsOfService')}
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
