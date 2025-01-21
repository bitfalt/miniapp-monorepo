'use client'

import React, { useState } from 'react'
import { TestCard } from '@/components/ui/TestCard'
import SearchBar from '@/components/ui/SearchBar'

const testData = [
  {
    totalQuestions: 10,
    answeredQuestions: 1,
    achievements: [{ id: '1', title: 'Achievement 1', description: 'Description 1' }],
    title: "Ideology Test"
  },
  {
    totalQuestions: 50,
    answeredQuestions: 25,
    achievements: [{ id: '2', title: 'Achievement 2', description: 'Description 2' }],
    title: "Personality Test"
  },
  {
    totalQuestions: 10,
    answeredQuestions: 1,
    achievements: [{ id: '3', title: 'Achievement 3', description: 'Description 3' }],
    title: "Personality Test 2"
  }
];

export default function TestsPage() {
  const [filteredTests, setFilteredTests] = useState(testData);

  const handleSearch = (query: string) => {
    const lowercasedQuery = query.toLowerCase();
    const results = testData.filter(test => 
      test.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTests(results);
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto mb-8 bg-gradient-to-br from-[#387478] to-[#2C5154] text-white p-6 sm:p-8 md:p-10 rounded-3xl">
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Your journey to Self-Awareness
          </h1>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search for tests" 
          className="relative mb-6 rounded-full"
        />

        <div className="bg-teal-600 rounded-full py-2 px-4 shadow-inner">
          <p className="text-center text-xs sm:text-sm">
            Complete 3 tests to unlock the Insight Seeker Badge!
          </p>
        </div>
      </div>
      <div className="space-y-6 max-w-md mx-auto"> 
        {filteredTests.map((test, index) => (
          <TestCard
            key={index}
            totalQuestions={test.totalQuestions}
            answeredQuestions={test.answeredQuestions}
            achievements={test.achievements}
            onCardClick={() => console.log(`${test.title} clicked`)}
            title={test.title}
          />
        ))}
      </div>

      <p className="text-center mt-8 text-xs sm:text-sm text-gray-600 font-bold">
        Hey! There are more tests Coming Soon! 🎉
      </p>
    </main>
  )
}