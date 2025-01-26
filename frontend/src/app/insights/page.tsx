"use client";

import React, { useEffect, useState } from 'react';
import { InsightResultCard } from '@/components/ui/InsightResultCard';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/insights')
      const data = await response.json()
      setInsights(data)
    const econ = searchParams.get('econ');
    const dipl = searchParams.get('dipl');
    const govt = searchParams.get('govt');
    const scty = searchParams.get('scty');

    try {
      const response = await fetch(`/api/insights?econ=${econ}&dipl=${dipl}&govt=${govt}&scty=${scty}`);
      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [searchParams]);

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
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-8 pb-16">
        {insights.map((insight, index) => (
          <InsightResultCard
            key={index}
            title={`${insight.axis.charAt(0).toUpperCase() + insight.axis.slice(1)} Perspective`}
            description={insight.insight}
            scale={insight.percentage}
            values={insight.values}
          />
        ))}
      </div>
    </div>
  );
}