"use client"

import { FilledButton } from "@/components/ui/FilledButton"
import { Crown, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AwakenProPage() {
  return (
    <div className="min-h-screen bg-neutral-bg">

      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Step Into the Next Level
          </h1>
          <p className="text-slate-200 text-lg mb-4 max-w-sm mx-auto font-medium">
            Current plan: <span className="text-accent-red font-bold">Basic</span>
          </p>
        </div>
      </div>


      <div className="max-w-md mx-auto px-6">
        <div className={cn(
          "bg-brand-secondary rounded-[30px] p-8 relative overflow-hidden",
          "shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]"
        )}>

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
            <div className="text-4xl font-bold text-white mb-2">$4.99</div>
            <div className="text-slate-300 text-sm">Per month, billed monthly</div>
          </div>


          <div className="space-y-4 mb-8">
            {[
              "Advanced analytics",
              "Exclusive badges and titles",
              "Shareable results",
              "High quality graphs",
              "Priority support"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-accent-red" />
                <span className="text-white font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <FilledButton
            variant="default"
            size="lg"
            className="w-full bg-accent-red hover:bg-accent-red/90"
          >
            Upgrade to Pro
          </FilledButton>
        </div>
      </div>
    </div>
  )
} 