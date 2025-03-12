"use client";

import {
  FilledButton,
} from "@/components/ui/buttons";
import {
  LoadingSpinner,
} from "@/components/ui/feedback";
import { MembershipCard } from "@/components/ui/cards";
import { NotificationsToggle } from "@/components/ui/NotificationsToggle";
import { SettingsCard } from "@/components/ui/cards";
// import { ToggleSwitch } from "@/components/ui/ToggleSwitch"; // Commented out as it's not currently used
import { clearVerificationSession } from "@/hooks/useVerification";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bell,
  Crown,
  FileText,
  Flag,
  Globe,
  HelpCircle,
  type LucideIcon,
  Moon,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type * as React from "react";
import { useEffect, useState } from "react";
import { LanguageDropdown } from "@/components/ui/LanguageDropdown";
import { useTranslation } from "@/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

// Dummy toggle switch that doesn't actually change theme
function DummyToggleSwitch() {
  const [checked, setChecked] = useState(true);
  const { t } = useTranslation();
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? t('toggle.darkModeOn') : t('toggle.darkModeOff')}
      onClick={() => setChecked(prev => !prev)}
      className={cn(
        "h-6 w-12 rounded-full transition-colors duration-200",
        checked ? "bg-accent-red" : "bg-neutral-grey",
      )}
    >
      <span
        className={cn(
          "block h-[18px] w-5 rounded-full bg-white transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

interface SubscriptionData {
  next_payment_date: string | null;
  isPro: boolean;
  subscription_start: string | null;
  subscription_expires: string | null;
}

interface SettingItem {
  Icon: LucideIcon;
  label: string;
  element?: React.ReactNode;
  onClick?: () => void;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    next_payment_date: null,
    isPro: false,
    subscription_start: null,
    subscription_expires: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const subscriptionResponse = await fetch("/api/user/subscription", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          credentials: "include",
        });

        if (subscriptionResponse.ok) {
          const data = await subscriptionResponse.json();
          setSubscriptionData({
            next_payment_date: data.next_payment_date || null,
            isPro: data.isPro || false,
            subscription_start: data.subscription_start || null,
            subscription_expires: data.subscription_expires || null,
          });
        }
      } catch {
        // Error handling is done via the UI loading state
      } finally {
        setLoading(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void fetchSettings();
      }
    };

    void fetchSettings();

    window.addEventListener("focus", fetchSettings);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", fetchSettings);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleUpgradeClick = () => {
    router.push("/awaken-pro");
  };

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

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      preserveLanguagePreference(async () => {
        clearVerificationSession();

        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (response.ok) {
          window.location.href = "/sign-in";
        }
      });
    } catch {
      // Error handling is done via the UI state
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: "en" | "es") => {
    setLanguage(language);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative mb-6 overflow-hidden rounded-b-[50px] bg-brand-tertiary pb-8 shadow-lg sm:mb-8 sm:pb-14">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
        <motion.div
          className="relative z-10 mx-auto w-full max-w-2xl space-y-4 px-4 pt-16 sm:pt-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3 text-center">
            <Settings className="mx-auto h-10 w-10 text-[#E36C59]" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              {t('settings.title')}
            </h1>
          </div>

          <p className="font-spaceGrotesk text-center text-lg font-normal leading-[25px] text-[#C9CDCE]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm"
            >
              {subscriptionData.isPro && (
                <Crown className="h-5 w-5 text-[#e36c59]" />
              )}
              <span className="font-medium text-white/90">
                {subscriptionData.isPro ? t('settings.membership.premium') : t('settings.membership.basic')}
              </span>
            </motion.div>
          </p>
        </motion.div>
      </div>

      <motion.div
        className="mx-auto mt-4 max-w-md px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <MembershipCard
            expiryDate={
              subscriptionData.next_payment_date || t('settings.membership.noSubscription')
            }
            isActive={subscriptionData.isPro}
            cost={3.5}
          />

          {!subscriptionData.isPro && (
            <div className="relative mt-4">
              <div className="absolute -inset-3 animate-pulse rounded-2xl bg-accent-red/20 blur-xl" />
              <FilledButton
                variant="primary"
                size="lg"
                className={cn(
                  "relative z-10 w-full transform bg-accent-red shadow-[0_10px_20px_rgba(227,108,89,0.3)] transition-all duration-300 hover:scale-[1.02] hover:bg-accent-red/90 hover:shadow-[0_14px_28px_rgba(227,108,89,0.4)]",
                )}
                onClick={handleUpgradeClick}
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5" />
                  <span>{t('settings.membership.upgrade')}</span>
                </div>
              </FilledButton>

              <div className="relative z-10 mt-3 mb-4 px-4 py-2 text-center">
                <p className="text-sm font-medium">
                  <span className="text-neutral-black">{t('settings.membership.unlockFeatures')}</span>
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-8 space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {(
            [
              {
                Icon: Bell,
                label: t('settings.items.notifications'),
                element: <NotificationsToggle />,
              },
              // Dark Theme toggle with dummy functionality
              { Icon: Moon, label: t('settings.items.darkTheme'), element: <DummyToggleSwitch /> },
              // Language dropdown
              { 
                Icon: Globe, 
                label: t('settings.items.language'), 
                element: <LanguageDropdown onChange={handleLanguageChange} /> 
              },
              {
                Icon: FileText,
                label: t('settings.items.privacyPolicy'),
                onClick: () => {},
              },
              { Icon: HelpCircle, label: t('settings.items.helpCenter'), onClick: () => {} },
              { Icon: Flag, label: t('settings.items.reportIssue'), onClick: () => {} },
            ] as SettingItem[]
          ).map((setting, index) => (
            <motion.div
              key={setting.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <SettingsCard
                icon={setting.Icon}
                label={setting.label}
                rightElement={setting.element}
                onClick={setting.onClick}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-20 mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <FilledButton
            variant="primary"
            size="lg"
            className="w-full bg-[#E36C59] hover:bg-[#E36C59]/90"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? t('settings.signingOut') : t('settings.signOut')}
          </FilledButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
