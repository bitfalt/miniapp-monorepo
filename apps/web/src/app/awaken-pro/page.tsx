"use client";

import { FilledButton } from "@/components/ui/buttons/FilledButton";
import { cn } from "@/lib/utils";
import {
  MiniKit,
  type PayCommandInput,
  type Tokens,
  tokenToDecimals,
} from "@worldcoin/minikit-js";
import { motion } from "framer-motion";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AwakenProPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"Basic" | "Pro">("Basic");
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch("/api/user/subscription");
        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.isPro ? "Pro" : "Basic");
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    const fetchPayAmount = async () => {
      try {
        const response = await fetch("/api/fetch-pay-amount");
        if (response.ok) {
          const data = await response.json();
          setPayAmount(data.amount);
        }
      } catch (error) {
        console.error("Error fetching pay amount:", error);
      }
    };

    fetchSubscriptionStatus();
    fetchPayAmount();
  }, []);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      if (!MiniKit.isInstalled()) {
        window.open("https://worldcoin.org/download-app", "_blank");
        return;
      }

      // Initiate payment
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
      });
      const { id } = await res.json();

      // Configure payment
      const payload: PayCommandInput = {
        reference: id,
        to: process.env.NEXT_PUBLIC_PAYMENT_ADDRESS ?? "",
        tokens: [
          {
            symbol: "WLD" as Tokens,
            token_amount: tokenToDecimals(
              payAmount,
              "WLD" as Tokens,
            ).toString(),
          },
        ],
        description: "Upgrade to Awaken Pro - 1 Month Subscription",
      };

      const { finalPayload } = await MiniKit.commandsAsync.pay(payload);

      if (finalPayload.status === "success") {
        // Verify payment
        const confirmRes = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: finalPayload }),
        });

        const payment = await confirmRes.json();
        if (payment.success) {
          // Force refresh subscription data on settings page
          router.refresh();
          router.push("/settings?upgrade=success");
        } else {
          console.error("Payment confirmation failed:", payment.error);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Step Into the Next Level
          </h1>
          <p className="text-slate-200 text-lg mb-4 max-w-sm mx-auto font-medium">
            Current plan:{" "}
            <span
              className={cn(
                "font-bold",
                currentPlan === "Pro" ? "text-accent-green" : "text-accent-red",
              )}
            >
              {currentPlan}
            </span>
          </p>
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="max-w-md mx-auto px-6 mb-8">
        <motion.div
          className={cn(
            "bg-brand-secondary rounded-[30px] p-8 relative overflow-hidden",
            "shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]",
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Crown className="w-12 h-12 text-accent-red" />
              <span className="text-4xl font-bold text-white">Pro</span>
            </div>
            <div className="bg-accent-red px-4 py-1 rounded-xl">
              <span className="text-white font-bold">Popular</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-4xl font-bold text-white mb-2">
              {payAmount} WLD
            </div>
            <div className="text-slate-300 text-sm">
              Per month, billed monthly
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Advanced Insights",
              "Early access to new features",
              "Exclusive Community Access",
              "Priority support",
              "Soon chat with AI",
              "More coming soon...",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent-red" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              y: [0, -4, 0],
              boxShadow: [
                "0 8px 16px rgba(227,108,89,0.3)",
                "0 12px 24px rgba(227,108,89,0.4)",
                "0 8px 16px rgba(227,108,89,0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Pulsing background effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-red/20 to-[#FF8066]/20 rounded-xl blur-xl animate-pulse" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              {["top", "middle", "bottom"].map((position) => (
                <motion.div
                  key={`particle-${position}`}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  animate={{
                    y: [-10, -40],
                    x:
                      Math.sin(
                        ["top", "middle", "bottom"].indexOf(position) * 45,
                      ) * 20,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: ["top", "middle", "bottom"].indexOf(position) * 0.4,
                    ease: "easeOut",
                  }}
                  style={{
                    left: `${25 + ["top", "middle", "bottom"].indexOf(position) * 25}%`,
                    bottom: "0",
                  }}
                />
              ))}
            </div>

            <FilledButton
              variant="primary"
              className={cn(
                "w-full bg-gradient-to-r from-accent-red to-[#FF8066]",
                "hover:from-accent-red/90 hover:to-[#FF8066]/90",
                "shadow-[0_8px_16px_rgba(227,108,89,0.3)]",
                "hover:shadow-[0_12px_24px_rgba(227,108,89,0.4)]",
                "transform transition-all duration-300",
                "relative overflow-hidden",
                "border border-white/10",
                "h-16",
                "text-white",
              )}
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{
                  animation: "shimmer 2s infinite",
                  backgroundSize: "200% 100%",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

              <div className="relative z-10 flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 animate-pulse text-white" />
                <span className="font-bold text-lg tracking-wide">
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span>Processing</span>
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        ...
                      </motion.div>
                    </div>
                  ) : (
                    <motion.span
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      Upgrade to Pro
                    </motion.span>
                  )}
                </span>
              </div>
            </FilledButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
