"use client";

import { InsightsDetail } from '@/components/ui/InsightResultCard';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <InsightsDetail 
        title="Your Economic Perspective"
        description="You lean towards Equality, valuing fairness and redistribution of wealth."
        className="my-4"
      />
    </div>
  );
}
