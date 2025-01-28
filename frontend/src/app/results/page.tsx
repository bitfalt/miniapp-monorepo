"use client"

import { useState, useEffect } from 'react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ActionCard } from "@/components/ui/ActionCard"
import { LucideIcon, Brain, Heart, Star, Trophy } from "lucide-react"
import { useRouter } from 'next/navigation'

interface TestResult {
  title: string
  backgroundColor: string
  iconBgColor: string
  Icon: LucideIcon
  isEnabled: boolean
  testId?: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<TestResult[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/tests')
        const data = await response.json()
        
        const transformedResults = data.tests.map((test: any) => ({
          title: test.testName || "Political Values Test",
          backgroundColor: "#387478",
          iconBgColor: "#2C5154",
          Icon: Brain,
          isEnabled: true,
          testId: test.testId
        }))
        
        const comingSoonCards = [
          {
            title: "Personality Test (Coming Soon)",
            backgroundColor: "#8B5CF6",
            iconBgColor: "#7C3AED",
            Icon: Heart,
            isEnabled: false
          },
          {
            title: "Coming Soon",
            backgroundColor: "#EC4899",
            iconBgColor: "#DB2777",
            Icon: Star,
            isEnabled: false
          },
          {
            title: "Coming Soon",
            backgroundColor: "#F59E0B",
            iconBgColor: "#D97706",
            Icon: Trophy,
            isEnabled: false
          }
        ]
        
        setTestResults([...transformedResults, ...comingSoonCards])
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const handleCardClick = (testId: string) => {
    router.push(`/tests/results/${testId}`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-brand-tertiary rounded-b-[50px] shadow-lg pb-8 sm:pb-14 mb-6 sm:mb-8">
        <div className="w-full max-w-2xl mx-auto px-4 pt-16 sm:pt-20">
          <h1 className="text-center text-white text-3xl sm:text-4xl md:text-5xl font-bold font-spaceGrotesk leading-tight sm:leading-[50px] mb-3 sm:mb-4">
            Tests Results
          </h1>
          <p className="text-center text-[#C9CDCE] text-lg font-normal font-spaceGrotesk leading-[25px]">
            Insights based on <span className="font-bold">your results</span>
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 gap-6 justify-items-center max-w-[400px] mx-auto">
          {testResults.map((test, index) => (
            <ActionCard
              key={index}
              title={test.title}
              backgroundColor={test.backgroundColor}
              iconBgColor={test.iconBgColor}
              Icon={test.Icon}
              isClickable={test.isEnabled}
              onClick={() => test.testId && test.isEnabled && handleCardClick(test.testId)}
              className={`transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                !test.isEnabled && "opacity-30 cursor-not-allowed"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 