'use client'

import { useState } from 'react'
import IdeologyTag from './InsightResultTag'

interface ResultCardProps {
  equalityPercentage: number
  className?: string
}

export default function ResultCard({ equalityPercentage, className = '' }: ResultCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div 
      className={`w-full max-w-sm cursor-pointer bg-gradient-to-br from-[#387478] to-[#2C5154] text-white rounded-3xl overflow-hidden shadow-lg ${className}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="relative z-10 p-6">
        <h2 className="text-center text-3xl font-bold mb-4 tracking-tight">
          Your Economic Perspective
        </h2>
        <div className="space-y-4">
          <div className="text-center text-sm font-bold">
            {`${equalityPercentage}% Equality | ${100 - equalityPercentage}% Markets`}
          </div>
          <div className="flex justify-center">
            <IdeologyTag scale={equalityPercentage} />
          </div>
          <div className="text-center text-xs font-medium">
            {showDetails ? 'Click to hide details' : 'Click here to see more details'}
          </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="relative z-10 p-6 bg-white/10">
          <p className="text-sm leading-relaxed">
            Your economic perspective leans towards a balance between equality and market forces. 
            This suggests a preference for policies that combine elements of both social welfare and free-market principles.
          </p>
        </div>
      )}
    </div>
  )
}
