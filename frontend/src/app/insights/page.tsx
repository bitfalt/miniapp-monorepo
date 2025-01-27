"use client";

import React, { useEffect, useState } from 'react';
import { InsightResultCard } from '@/components/ui/InsightResultCard';
import { useSearchParams } from 'next/navigation';
import { FilledButton } from '@/components/ui/FilledButton';

interface Insight {
  axis: string;
  percentage: number;
  insight: string;
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
  const [isProUser, setIsProUser] = useState(false);
  const [fullAnalysis, setFullAnalysis] = useState<string>('');
  const searchParams = useSearchParams();

  const fetchInsights = async () => {
    setLoading(true);
    const econ = searchParams.get('econ');
    const dipl = searchParams.get('dipl');
    const govt = searchParams.get('govt');
    const scty = searchParams.get('scty');

    try {
      // Check user's pro status
      const userResponse = await fetch('/api/user/subscription');
      const userData = await userResponse.json();
      setIsProUser(userData.isPro);

      // Fetch insights
      const response = await fetch(`/api/insights?econ=${econ}&dipl=${dipl}&govt=${govt}&scty=${scty}`);
      const data = await response.json();
      setInsights(data.insights);

      // Call DeepSeek API for full analysis
      const deepSeekResponse = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          econ: parseFloat(econ || '0'),
          dipl: parseFloat(dipl || '0'),
          govt: parseFloat(govt || '0'),
          scty: parseFloat(scty || '0'),
        }),
      });

      if (deepSeekResponse.ok) {
        const deepSeekData = await deepSeekResponse.json();
        setFullAnalysis(deepSeekData.analysis);
      } else {
        console.error('Error fetching DeepSeek analysis:', deepSeekResponse.statusText);
        setFullAnalysis('Failed to generate analysis. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setFullAnalysis('Failed to generate analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [searchParams]);

  const handleAdvancedInsightsClick = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <p className="text-slate-200">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-tertiary/50 to-transparent"></div>
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Your Ideology Insights
          </h1>
          <p className="text-slate-200/90 text-lg mb-4 max-w-sm mx-auto font-medium leading-relaxed">
            Explore how your values align across key ideological dimensions.
          </p>
          
          <div className="flex justify-center">
            <FilledButton
              onClick={handleAdvancedInsightsClick}
              variant={isProUser ? 'default' : 'default'}
              className="mt-4"
            >
              {isProUser ? 'Advanced Insights' : 'Unlock Advanced Insights'}
            </FilledButton>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-8 pb-16">
        {Array.isArray(insights) && insights.length > 0 ? (
          insights.map((insight, index) => (
            <InsightResultCard
              key={index}
              title={`${insight.axis.charAt(0).toUpperCase() + insight.axis.slice(1)} Perspective`}
              description={insight.insight}
              scale={insight.percentage}
              values={insight.values}
            />
          ))
        ) : (
          <p className="text-slate-200">No insights available. Please try again later.</p>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 overflow-hidden animate-modal-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {isProUser ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  Advanced Ideological Analysis
                </h2>

                <div className="overflow-y-auto max-h-[70vh] pr-4 scrollbar-custom">
                  <p className="text-white/90 leading-relaxed text-base whitespace-pre-wrap text-center">
                    {fullAnalysis}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Unlock Advanced Insights
                </h2>
                <p className="text-white/90 mb-6">
                  Dive deeper into your ideological profile with Awaken Pro. Get comprehensive analysis and personalized insights.
                </p>
                <div className="flex justify-center">
                  <FilledButton
                    variant="default"
                    onClick={() => {
                      window.location.href = '/awaken-pro';
                    }}
                  >
                    Upgrade to Pro
                  </FilledButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}