"use client"

import SearchBar from "@/components/ui/SearchBar"
import { TestCard } from "@/components/ui/TestCard"

export default function TestsPage() {
  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log('Searching for:', query)
  }

  // Example test data - this would typically come from your API
  const testData = {
    title: "Personality Test",
    totalQuestions: 20,
    answeredQuestions: 8,
    achievements: [
      { id: "1", title: "Quick Thinker", description: "Completed test in record time" },
      { id: "2", title: "Explorer", description: "Started your first test" }
    ]
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Available Tests
          </h1>
          <p className="text-slate-200 text-lg mb-4 max-w-sm mx-auto font-medium">
            Explore our collection of tests to understand yourself better
          </p>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search for tests..."
            className="mb-6"
          />
        </div>
      </div>

      <div className="flex flex-col items-center md:p-6">
        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestCard
              title={testData.title}
              totalQuestions={testData.totalQuestions}
              answeredQuestions={testData.answeredQuestions}
              achievements={testData.achievements}
              onCardClick={() => {/* Handle click */}}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 