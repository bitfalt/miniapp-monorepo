"use client"

import { useState, useEffect } from 'react'
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import AchievementCard from "@/components/ui/AchievementCard"

interface Achievement {
  title: string
  description: string
  date?: string
  obtained: boolean
}

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState({ current: 0, max: 100, title: "" })
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/achievements')
        const data = await response.json()
        setLevel(data.level)
        setAchievements(data.achievements)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Header Card */}
      <div className="bg-brand-tertiary p-10 pt-16 pb-12 rounded-b-[4rem] shadow-lg border-b border-brand-tertiary/20 relative overflow-hidden mb-8">
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-slate-100 mb-4 tracking-tight">
            Achievements
          </h1>
          <p className="text-slate-200 text-lg mb-9 max-w-sm mx-auto font-medium">
            Celebrate your progress and discover what&apos;s next on your journey
          </p>
          
          {/* Level Progress */}
          <div className="space-y-4 max-w-sm mx-auto bg-brand-secondary p-6 rounded-3xl backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] border border-brand-tertiary/10">
            <div className="flex justify-between text-sm text-slate-100 font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-red rounded-full inline-block"></span>
                {level.title}
              </span>
              <span>{level.current}/{level.max} points</span>
            </div>
            <div className="h-3 bg-neutral-bg/90 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-accent-red transition-all duration-500 rounded-full"
                style={{ 
                  width: `${(level.current / level.max) * 100}%`,
                }}
              />
            </div>
            <p className="text-sm text-slate-200 font-medium">
              Reach the next level to unlock new badges and exclusive content!
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Cards */}
      <div className="max-w-md mx-auto px-6 space-y-4">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`transition-all duration-300 ${
              !achievement.obtained && 'opacity-60'
            }`}
          >
            <AchievementCard
              title={achievement.title}
              description={achievement.description}
              date={achievement.obtained ? achievement.date : "Locked"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}