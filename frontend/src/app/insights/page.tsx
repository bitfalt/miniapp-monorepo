import React from 'react';
import { InsightResultCard } from '@/components/ui/InsightResultCard';

export default function InsightsPage() {
  const insights = [
    {
      id: 'economic',
      title: 'Economic Perspective',
      description:
        'You have a balanced view between equality and market values, suggesting a pragmatic approach to economic policy.',
      scale: 50,
      values: { left: 60, right: 40, label: 'Equality / Markets' },
    },
    {
      id: 'civil',
      title: 'Your Civil Values',
      description:
        'Your perspective favors individual liberty while recognizing the importance of social order and structure.',
      scale: 40,
      values: { left: 60, right: 40, label: 'Liberty / Authority' },
    },
    {
      id: 'societal',
      title: 'Your Societal Values',
      description:
        'You maintain a balanced outlook between traditional values and progressive change, adapting to modern needs while respecting established norms.',
      scale: 45,
      values: { left: 45, right: 55, label: 'Tradition / Progress' },
    },
    {
      id: 'diplomatic',
      title: 'Your Diplomatic Values',
      description:
        'Your diplomatic stance shows a balanced approach between national interests and global cooperation.',
      scale: 30,
      values: { left: 40, right: 60, label: 'Nation / Globe' },
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Updated Header Section */}
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-tertiary/50 to-transparent"></div>
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Your Ideology Insights
          </h1>
          <p className="text-slate-200/90 text-lg mb-4 max-w-sm mx-auto font-medium leading-relaxed">
            Discover how your values align across key ideological dimensions.
          </p>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="max-w-3xl mx-auto px-6 space-y-8 pb-16">
        {insights.map((insight) => (
          <InsightResultCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            scale={insight.scale}
            values={insight.values}
          />
        ))}
      </div>
    </div>
  );
}
