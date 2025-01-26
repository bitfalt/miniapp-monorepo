'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Brain, ArrowLeft, FileQuestion } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { FilledButton } from "@/components/ui/FilledButton"

interface TestInstructions {
  description: string
  total_questions: number
}

export default function TestInstructions() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testId = searchParams.get('testId') || '1' // Fallback to 1 for now
  
  const [loading, setLoading] = useState(true)
  const [instructions, setInstructions] = useState<TestInstructions>({
    description: '',
    total_questions: 0
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const estimatedTime = Math.ceil(instructions.total_questions * 0.15) // Roughly 9 seconds per question

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch(`/api/tests/${testId}/instructions`)
        const data = await response.json()
        
        setInstructions({
          description: data.description,
          total_questions: data.total_questions
        })
      } catch (error) {
        console.error('Error fetching instructions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructions()
  }, [testId])

  if (loading) {
    return <LoadingSpinner />
  }

  const progress = (currentQuestion / instructions.total_questions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#387478] to-[#2C5154] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
      
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[421px] mx-auto relative py-8 sm:py-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0"
          >
            <FilledButton 
              variant="default"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back</span>
            </FilledButton>
          </motion.div>

        <motion.div 
          className="space-y-6 sm:space-y-8 mt-16 sm:mt-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center space-y-4">
            <Brain className="h-12 w-12 mx-auto text-[#E36C59]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight px-4">
              Uncover Your Political Values
            </h1>
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white p-5 sm:p-6 mx-4">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-center">
                Before you start
              </h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileQuestion className="h-5 w-5 text-[#E36C59] mt-1 flex-shrink-0" />
                    <p className="text-sm text-white/90">
                      This test consists of {instructions.total_questions} thought-provoking statements designed to explore your political beliefs. Your answers will reflect your position across eight core values.
                    </p>
                  </div>

                <div className="bg-white/5 p-2 sm:p-3 rounded-lg border border-white/10">
                  <p className="text-center text-sm text-white/90 font-medium">
                    Please respond honestly, based on your true opinions.
                  </p>
                </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <p className="text-xs sm:text-sm text-white/90">
                      Estimated Time: <span className="font-semibold text-white">{estimatedTime} min</span>
                    </p>
                    <p className="text-xs sm:text-sm text-white/90">
                      Progress: <span className="font-semibold text-white">{currentQuestion}/{instructions.total_questions}</span>
                    </p>
                  </div>
                </div>

                {currentQuestion > 0 && (
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#E36C59]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
              </div>
            </Card>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-center px-4"
            >
              <FilledButton 
                variant="default"
                size="lg"
                className="w-full sm:w-auto px-8 bg-gradient-to-r from-[#E36C59] to-[#E36C59]/90 hover:from-[#E36C59]/90 hover:to-[#E36C59] text-white"
                onClick={() => router.push(`/ideology-test?testId=${testId}`)}
              >
                {currentQuestion > 0 ? 'Continue test' : 'Start test'}
              </FilledButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#387478]/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#2C5154]/40 rounded-full blur-3xl" />
    </div>
  )
}