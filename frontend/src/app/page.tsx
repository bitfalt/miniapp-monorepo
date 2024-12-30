"use client";

import { ActionCard } from '@/components/ui/ActionCard'
import { ArrowDownLeft } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-24 bg-background">
      <div className="flex gap-4 flex-wrap justify-center max-w-4xl mx-auto">
        <ActionCard
          title="Personality Test"
          backgroundColor="#D87566"
          iconBgColor="#2C5154"
          Icon={ArrowDownLeft}
        />
      </div>
    </main>
  )
}