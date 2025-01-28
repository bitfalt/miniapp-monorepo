import React from 'react';
import InsightResultTag from '@/components/ui/InsightResultTag';

interface InsightResultCardProps {
  title: string;
  insight: string;
  description: string;
  values: {
    left: number;
    right: number;
    label: string;
  };
}

export function InsightResultCard({ title, insight, description, values }: InsightResultCardProps) {
  return (
    <div className="bg-brand-secondary rounded-3xl p-8 shadow-lg border border-brand-tertiary/10 hover:shadow-xl transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold text-slate-100 mb-4 tracking-tight">{title}</h2>
      <p className="text-slate-200/90 mb-8 italic leading-relaxed">"{insight}"</p>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-slate-200/90 font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-red rounded-full"></span>
            {values.label.split(' / ')[0]}
          </span>
          <span className="flex items-center gap-2">
            {values.label.split(' / ')[1]}
            <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
          </span>
        </div>
        <div className="h-3 bg-neutral-bg/90 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-accent-red to-accent-redSoft transition-all duration-500 rounded-full"
            style={{ width: `${values.left}%` }}
          />
        </div>
        <div className="flex justify-center mt-6">
          {/* <InsightResultTag scale={scale} /> */}
          <div
            className="inline-flex px-4 py-1.5 bg-emerald-400 text-emerald-950 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {description.charAt(0).toUpperCase() + description.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
}