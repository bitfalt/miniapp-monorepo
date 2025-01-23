"use client"

import { useRouter } from 'next/navigation'

export function LeaderboardButton() {
  const router = useRouter()

  return (
    <button
      className="w-full max-w-[365px] bg-brand-tertiary hover:bg-brand-tertiary/90 text-white rounded-2xl p-6 flex items-center justify-between transform transition-all duration-300 hover:scale-105"
      onClick={() => router.push('/leaderboard')}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brand-secondary rounded-xl">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M16 3H8C7.44772 3 7 3.44772 7 4V7H17V4C17 3.44772 16.5523 3 16 3Z" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              d="M4 8C4 7.44772 4.44772 7 5 7H19C19.5523 7 20 7.44772 20 8V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V8Z" 
              stroke="currentColor" 
              strokeWidth="2"
            />
            <path 
              d="M12 11L12 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M8 14L8 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M16 14L16 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">See Leaderboard</span>
          <span className="text-sm text-slate-200">Check where you rank among others</span>
        </div>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
} 