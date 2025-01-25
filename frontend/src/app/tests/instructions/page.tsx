'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Brain, ArrowLeft, FileQuestion } from 'lucide-react'

interface TestInstructionsProps {
  totalQuestions?: number
  currentQuestion?: number
  estimatedTime?: number
}

export default function TestInstructions({
  totalQuestions = 70,
  currentQuestion = 0,
  estimatedTime = 10
}: TestInstructionsProps) {
  const router = useRouter()
  const progress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-[#2C5154] p-2 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />

      <div className="max-w-[421px] mx-auto relative">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost"
            className="text-white mb-6 sm:mb-8 hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </motion.div>

        <motion.div 
          className="space-y-5 sm:space-y-7"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center space-y-3">
            <Brain className="h-10 w-10 mx-auto text-[#E36C59]" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Uncover Your Political Values
            </h1>
          </div>

          <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white p-4 sm:p-5">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-center">
                Before you start
              </h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileQuestion className="h-5 w-5 text-[#E36C59] mt-1 flex-shrink-0" />
                  <p className="text-sm text-white/90">
                    This test consists of {totalQuestions} thought-provoking statements designed to explore your political beliefs. Your answers will reflect your position across eight core values.
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
                    Progress: <span className="font-semibold text-white">{currentQuestion}/{totalQuestions}</span>
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
            className="flex justify-center"
          >
            <Button 
              className="px-5 bg-gradient-to-r from-[#E36C59] to-[#E36C59]/90 hover:from-[#E36C59]/90 hover:to-[#E36C59] text-white"
              onClick={() => router.push('/test/questions')}
            >
              {currentQuestion > 0 ? 'Continue test' : 'Start test'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}