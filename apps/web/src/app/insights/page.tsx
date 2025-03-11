"use client";

import { Canvas as ResultsCanvas } from "@/components/features";
import { FilledButton } from "@/components/ui/buttons/FilledButton";
import { InsightResultCard } from "@/components/ui/cards/InsightResultCard";
import { LoadingSpinner } from "@/components/ui/feedback/LoadingSpinner";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "@/i18n";

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
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState<string>("");
  const [ideology, setIdeology] = useState<string>("");
  const searchParams = useSearchParams();
  const [scores, setScores] = useState({ econ: 0, dipl: 0, govt: 0, scty: 0 });
  const [publicFigure, setPublicFigure] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const { t } = useTranslation();

  // Emit modal state changes
  useEffect(() => {
    const event = new CustomEvent("shareModalState", {
      detail: { isOpen: isShareModalOpen },
    });
    window.dispatchEvent(event);
  }, [isShareModalOpen]);

  // Emit advanced insights modal state changes
  useEffect(() => {
    const event = new CustomEvent("shareModalState", {
      detail: { isOpen: isModalOpen },
    });
    window.dispatchEvent(event);
  }, [isModalOpen]);

  // Combined effect to ensure bottom nav stays hidden when either modal is open
  useEffect(() => {
    const isAnyModalOpen = isShareModalOpen || isModalOpen;
    const event = new CustomEvent("shareModalState", {
      detail: { isOpen: isAnyModalOpen },
    });
    window.dispatchEvent(event);
  }, [isShareModalOpen, isModalOpen]);

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
        if (!scoresResponse.ok) {
          throw new Error("Failed to fetch scores");
        }
        const scoresData = await scoresResponse.json();
        setScores(scoresData.scores);

        // Get public figure match
        const figureResponse = await fetch("/api/public-figures");
        if (!figureResponse.ok) {
          throw new Error("Failed to fetch public figure match");
        }
        const figureData = await figureResponse.json();
        setPublicFigure(figureData.celebrity || "Unknown Match");

      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchInsights();
  }, [testId]);

  // Separate effect for Gemini API call
  useEffect(() => {
    async function fetchGeminiAnalysis() {
      if (!isProUser || !isModalOpen) return;
      
      setIsGeminiLoading(true);
      try {
        const geminiResponse = await fetch("/api/gemini-flash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            econ: scores.econ || 0,
            dipl: scores.dipl || 0,
            govt: scores.govt || 0,
            scty: scores.scty || 0,
          }),
        });

        if (geminiResponse.status === 200) {
          const geminiData = await geminiResponse.json();
          setFullAnalysis(geminiData.analysis);
        } else {
          console.error(
            "Error fetching Gemini analysis:",
            geminiResponse.statusText,
          );
          setFullAnalysis(
            "Failed to generate analysis. Please try again later.",
          );
        }
      } catch (error) {
        console.error("Error fetching Gemini analysis:", error);
        setFullAnalysis("Failed to generate analysis. Please try again later.");
      } finally {
        setIsGeminiLoading(false);
      }
    }

    void fetchGeminiAnalysis();
  }, [isProUser, isModalOpen, scores]);

  const handleAdvancedInsightsClick = () => {
    setIsModalOpen(true);
  };

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleShareAnalysis = () => {
    setIsShareModalOpen(true);
    
    setTimeout(() => {
      setIsModalOpen(false);
    }, 50);
  };

  const handleInstagramShare = async () => {
    if (!canvasRef.current) return;

    try {
      // Convert canvas to Blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Canvas conversion failed"));
          }
        }, "image/png");
      });
      const file = new File([await blob], "results.png", { type: "image/png" });

      // Use native share if available
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: "My Political Compass Results",
            text: "Check out my political compass results!",
          });
          return;
        } catch (error) {
          console.error("Error with native sharing:", error);
        }
      }

      // Fallback: share via Instagram Stories URL scheme
      const dataUrl = canvasRef.current?.toDataURL("image/png");
      const encodedImage = encodeURIComponent(dataUrl);
      const instagramUrl = `instagram-stories://share?backgroundImage=${encodedImage}&backgroundTopColor=%23000000&backgroundBottomColor=%23000000`;
      window.location.href = instagramUrl;

      // Alert if Instagram doesn't open automatically
      setTimeout(() => {
        alert(
          "If Instagram did not open automatically, please open Instagram and use the image from your camera roll to share to your story.",
        );
      }, 2500);

      // Final fallback: download the image
      const link = document.createElement("a");
      link.download = "results.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error sharing to Instagram:", error);
      alert(
        "Unable to share directly to Instagram. The image has been downloaded to your device - you can manually share it to your Instagram story.",
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative mb-6 overflow-hidden rounded-b-[50px] bg-brand-tertiary pb-8 shadow-lg sm:mb-8 sm:pb-14">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
        <motion.div
          className="relative z-10 text-center max-w-md mx-auto space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-[#E36C59]" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
              {t('insights.title')}
            </h1>
          </div>

          <p className="font-spaceGrotesk text-center text-lg font-normal leading-[25px] text-[#C9CDCE]">
            {t('insights.description')}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="mx-auto mt-4 max-w-md px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-8 flex justify-between">
          <FilledButton
            variant="primary"
            size="sm"
            className="bg-[#E36C59] hover:bg-[#E36C59]/90"
            onClick={handleAdvancedInsightsClick}
          >
            {t('insights.advancedInsights')}
          </FilledButton>

          <FilledButton
            variant="primary"
            size="sm"
            className="bg-[#E36C59] hover:bg-[#E36C59]/90"
            onClick={handleShareClick}
          >
            {t('insights.shareInsights')}
          </FilledButton>
        </div>

        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.category}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <InsightResultCard
                title={t(`insights.categories.${insight.category.toLowerCase()}`)}
                percentage={insight.percentage}
                insight={insight.insight}
                description={insight.description}
                left_label={insight.left_label}
                right_label={insight.right_label}
                values={insight.values}
              />
            </motion.div>
          ))}
        </div>

        {/* Canvas for sharing (hidden) */}
        <div className="hidden">
          <ResultsCanvas
            ref={canvasRef}
            econ={scores.econ}
            dipl={scores.dipl}
            govt={scores.govt}
            scty={scores.scty}
            closestMatch={publicFigure}
            ideology={ideology}
            onLoad={() => setIsCanvasLoading(false)}
          />
        </div>
      </motion.div>

      {/* Advanced Insights Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{t('insights.aiAnalysis')}</h2>
            
            {isGeminiLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E36C59]/20 border-t-[#E36C59]"></div>
                <span className="ml-3 text-gray-600">{t('insights.loading')}</span>
              </div>
            ) : (
              <>
                <div className="prose prose-sm mb-6 max-w-none">
                  <p>{fullAnalysis}</p>
                </div>
                
                <div className="flex justify-between">
                  <FilledButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {t('common.close')}
                  </FilledButton>
                  
                  <FilledButton
                    variant="primary"
                    size="sm"
                    className="bg-[#E36C59] hover:bg-[#E36C59]/90"
                    onClick={handleShareAnalysis}
                  >
                    {t('insights.shareInsights')}
                  </FilledButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">{t('insights.shareInsights')}</h2>
            
            {isCanvasLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E36C59]/20 border-t-[#E36C59]"></div>
                <span className="ml-3 text-gray-600">{t('common.loading')}</span>
              </div>
            ) : (
              <>
                <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={canvasRef.current?.toDataURL()}
                    alt="Your results"
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between">
                  <FilledButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    {t('common.close')}
                  </FilledButton>
                  
                  <FilledButton
                    variant="primary"
                    size="sm"
                    className="bg-[#E36C59] hover:bg-[#E36C59]/90"
                    onClick={handleInstagramShare}
                  >
                    {t('common.share')}
                  </FilledButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Emit modal state for bottom nav visibility */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dispatchEvent(new CustomEvent('modalState', { 
              detail: { isOpen: ${isModalOpen} }
            }));
          `,
        }}
      />
    </div>
  );
}
