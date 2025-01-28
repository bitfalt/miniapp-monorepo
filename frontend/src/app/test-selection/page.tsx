"use client"

import SearchBar from "@/components/ui/SearchBar"
import { TestCard } from "@/components/ui/TestCard"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
}

interface TestData {
  testId: string
  title: string
  totalQuestions: number
  answeredQuestions: number
  achievements: Achievement[]
}

export default function TestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState<TestData>({
    testId: "",
    title: "",
    totalQuestions: 0,
    answeredQuestions: 0,
    achievements: []
  })
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch test data
        const response = await fetch('/api/tests')
        const data = await response.json()
        
        if (data.tests && data.tests.length > 0) {
          const firstTest = data.tests[0]
          
          // Fetch progress for this test
          const progressResponse = await fetch(`/api/tests/${firstTest.testId}/progress`)
          const progressData = await progressResponse.json()
          
          const answeredCount = progressData.answers ? Object.keys(progressData.answers).length : 0
          
          setTestData({
            testId: firstTest.testId,
            title: firstTest.testName,
            totalQuestions: firstTest.totalQuestions || 0,
            answeredQuestions: answeredCount,
            achievements: firstTest.achievements || []
          })
        } else {
          console.log('No tests found in response') // Debug log
        }
      } catch (error) {
        console.error('Error fetching test data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
        
        <motion.div 
          className="relative z-10 text-center max-w-md mx-auto space-y-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center space-y-3">
            <Brain className="h-10 w-10 mx-auto text-[#E36C59]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              Available Tests
            </h1>
          </div>
          
          <p className="text-slate-200 text-base sm:text-lg mb-4 max-w-sm mx-auto font-medium">
            Explore our collection of tests to understand yourself better
          </p>
          
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for tests..."
            className="w-full max-w-sm mx-auto"
          />
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-4">
            <p className="text-center text-sm text-white/90">
              Achievements coming soon! 🏆
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="flex flex-col items-center px-4 sm:px-6 md:px-8 pb-20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestCard
              title={testData.title}
              totalQuestions={testData.totalQuestions}
              answeredQuestions={testData.answeredQuestions}
              achievements={testData.achievements}
              onCardClick={() => router.push(`/tests/instructions?testId=${testData.testId}`)}
            />
            <div className="opacity-40 pointer-events-none">
              <TestCard
                title="Personality Test"
                totalQuestions={50}
                answeredQuestions={0}
                achievements={[]}
                onCardClick={() => {}}
              />
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          More tests coming soon! Stay tuned 🎉
        </p>
      </motion.div>
    </div>
  )
} 