"use client";

import { FilledButton } from "@/components/ui/buttons/FilledButton";
import { MiniKit } from "@worldcoin/minikit-js";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Clear any old session data
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      for (const c of document.cookie.split(";")) {
        document.cookie = `${c.replace(/^ +/, "").replace(/=.*/, "=;expires=")}${new Date().toUTCString()};path=/`;
      }
    }
  }, []);

  const handleWorldIDClick = async () => {
    setIsConnecting(true);
    try {
      setError(null);

      if (!MiniKit.isInstalled()) {
        router.push("https://worldcoin.org/download-app");
        return;
      }

      const nonceResponse = await fetch("/api/nonce", {
        credentials: "include",
      });
      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.error("Nonce fetch failed:", errorText);
        throw new Error(`Failed to fetch nonce: ${errorText}`);
      }

      const { nonce } = await nonceResponse.json();

      if (!nonce) {
        throw new Error("Invalid nonce received");
      }

      const { finalPayload } = await MiniKit.commandsAsync
        .walletAuth({
          nonce,
          statement: "Sign in with your Ethereum wallet",
        })
        .catch((error: unknown) => {
          console.error("Wallet auth command failed:", error);
          if (error instanceof DOMException) {
            if (error.name === "SyntaxError") {
              throw new Error("Invalid SIWE message format");
            }
            throw new Error("Authentication cancelled");
          }
          throw error;
        });

      if (!finalPayload || finalPayload.status !== "success") {
        console.error("Wallet auth failed:", finalPayload);
        throw new Error("Authentication failed");
      }

      // Get the wallet address from MiniKit after successful auth
      const walletAddress = MiniKit.user?.walletAddress;

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            "Failed to complete SIWE verification",
        );
      }

      const data = await response.json();

      if (data.status === "error" || !data.isValid) {
        throw new Error(data.message || "Failed to verify SIWE message");
      }

      // Get the normalized wallet address
      const userWalletAddress = (walletAddress || data.address)?.toLowerCase();

      if (!userWalletAddress) {
        throw new Error("No wallet address available");
      }

      // Check if user exists using the API endpoint
      const userCheckResponse = await fetch("/api/user/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: userWalletAddress }),
      });

      if (!userCheckResponse.ok) {
        const errorData = await userCheckResponse.json();
        throw new Error(errorData.error || "Failed to check user existence");
      }

      const userCheckData = await userCheckResponse.json();

      if (userCheckData.exists) {
        // User exists, create session and redirect to home
        try {
          const sessionResponse = await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              walletAddress: userWalletAddress,
              isSiweVerified: data.isValid,
            }),
          });

          if (!sessionResponse.ok) {
            const sessionError = await sessionResponse.json();
            throw new Error(sessionError.error || "Failed to create session");
          }

          // Add a small delay to ensure session is properly set
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Check if this is the user's first login
          const userResponse = await fetch("/api/user/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          });

          if (!userResponse.ok) {
            console.error(
              "Failed to fetch user data:",
              await userResponse.text(),
            );
            // If we can't fetch user data, just redirect to home
            router.push("/");
            return;
          }

          const userData = await userResponse.json();

          // If this is their first login (checking created_at vs updated_at)
          if (userData.createdAt === userData.updatedAt) {
            router.push("/welcome");
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Session/User data error:", error);
          // If something goes wrong after session creation, redirect to home
          router.push("/");
        }
      } else {
        // User doesn't exist, redirect to registration
        router.push(
          `/register?userId=${encodeURIComponent(userWalletAddress)}`,
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Authentication cancelled"
      ) {
        setError("Authentication was cancelled");
        return;
      }

      console.error("WorldID auth failed:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        type: error?.constructor?.name,
        code: error instanceof DOMException ? error.code : undefined,
        name: error instanceof DOMException ? error.name : undefined,
      });

      let errorMessage = "Authentication failed";
      if (error instanceof Error) {
        if (error.message === "Invalid SIWE message format") {
          errorMessage =
            "Failed to create authentication message. Please try again.";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
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
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2c5154] to-[#1d3638] px-4 py-12"
    >
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/mindvault-logo.png"
              alt="MindVault Logo"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
              priority
              loading="eager"
              sizes="80px"
            />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-4xl font-bold text-white"
          >
            {t('signIn.title')}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-lg text-white/80"
          >
            {t('signIn.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <FilledButton
              variant="primary"
              size="lg"
              className="w-full bg-[#e36c59] hover:bg-[#e36c59]/90"
              onClick={handleWorldIDClick}
              disabled={isConnecting}
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5" />
                <span>{t('signIn.worldIdButton')}</span>
              </div>
            </FilledButton>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md bg-red-500/10 p-3 text-center text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center text-xs text-white/60">
            {t('signIn.privacyNotice')}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-[#e36c59]/20 blur-3xl" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-[#2c5154]/40 blur-3xl" />
    </motion.div>
  );
}
