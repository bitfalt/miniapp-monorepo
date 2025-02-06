"use client";

import { FilledButton } from "@/components/ui/FilledButton";
import { InsightResultCard } from "@/components/ui/InsightResultCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Insight {
  category: string;
  percentage: number;
  insight: string;
  description: string;
  left_label: string;
  right_label: string;
  values: {
    left: number;
    right: number;
    label: string;
  };
}

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState<string>("");
  const [ideology, setIdeology] = useState<string>("");
  const searchParams = useSearchParams();

  const testId = searchParams.get("testId");

  useEffect(() => {
    async function fetchInsights() {
      try {
        // Check user's pro status
        const userResponse = await fetch("/api/user/subscription");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch subscription status");
        }
        const userData = await userResponse.json();
        setIsProUser(userData.isPro);

        // Fetch ideology
        const ideologyResponse = await fetch("/api/ideology");
        if (ideologyResponse.ok) {
          const ideologyData = await ideologyResponse.json();
          setIdeology(ideologyData.ideology);
        }

        // Fetch insights
        const response = await fetch(`/api/insights/${testId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }
        const data = await response.json();
        setInsights(data.insights);

        // Get scores from database
        const scoresResponse = await fetch(`/api/tests/${testId}/progress`);
        const scoresData = await scoresResponse.json();
        const { scores } = scoresData;

        // Call DeepSeek API for full analysis
        if (isProUser) {
          const deepSeekResponse = await fetch("/api/deepseek", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              econ: Number.parseFloat(scores.econ || "0"),
              dipl: Number.parseFloat(scores.dipl || "0"),
              govt: Number.parseFloat(scores.govt || "0"),
              scty: Number.parseFloat(scores.scty || "0"),
            }),
          });

          if (deepSeekResponse.status === 200) {
            const deepSeekData = await deepSeekResponse.json();
            setFullAnalysis(deepSeekData.analysis);
          } else {
            console.error(
              "Error fetching DeepSeek analysis:",
              deepSeekResponse.statusText,
            );
            setFullAnalysis(
              "Failed to generate analysis. Please try again later.",
            );
          }
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setFullAnalysis("Failed to generate analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    void fetchInsights();
  }, [testId, isProUser]);

  const handleAdvancedInsightsClick = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
        <motion.div
          className="relative z-10 text-center max-w-md mx-auto space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center space-y-3">
            <BookOpen className="h-10 w-10 mx-auto text-[#E36C59]" />
            <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
              Your Ideology Insights
            </h1>
          </div>
          {ideology && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 flex items-center justify-center min-h-[100px] mt-4"
            >
              <h2 className="text-3xl font-semibold text-slate-100 m-0">
                {ideology}
              </h2>
            </motion.div>
          )}
          <p className="text-slate-200/90 text-lg mb-4 max-w-sm mx-auto font-medium leading-relaxed">
            Explore how your values align across key ideological dimensions.
          </p>

          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FilledButton
              onClick={handleAdvancedInsightsClick}
              variant={isProUser ? "default" : "default"}
              className={cn(
                "mt-4",
                "transform transition-all duration-300 hover:scale-105",
              )}
            >
              {isProUser ? "Advanced Insights" : "Unlock Advanced Insights"}
            </FilledButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="max-w-3xl mx-auto px-6 space-y-8 pb-16"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {Array.isArray(insights) && insights.length > 0 ? (
          insights.map((insight) => (
            <motion.div
              key={`${insight.category}-${insight.percentage}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <InsightResultCard
                title={`${insight.category.charAt(0).toUpperCase() + insight.category.slice(1)} Perspective`}
                insight={insight.insight}
                description={insight.description}
                percentage={insight.percentage}
                left_label={insight.left_label}
                right_label={insight.right_label}
                values={insight.values}
              />
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-slate-200 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No insights available. Please try again later.
          </motion.p>
        )}
      </motion.div>

      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Close modal</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {isProUser ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Advanced Ideological Analysis
                </h2>

                <div className="overflow-y-auto max-h-[70vh] pr-4 scrollbar-custom">
                  <p className="text-white/90 leading-relaxed text-base whitespace-pre-wrap text-center">
                    {fullAnalysis}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Unlock Advanced Insights
                </h2>
                <p className="text-white/90 mb-6">
                  Dive deeper into your ideological profile with Awaken Pro. Get
                  comprehensive analysis and personalized insights.
                </p>
                <div className="flex justify-center">
                  <FilledButton
                    variant="default"
                    onClick={() => {
                      router.push("/awaken-pro");
                    }}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    Upgrade to Pro
                  </FilledButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
