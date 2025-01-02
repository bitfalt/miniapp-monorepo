import React from 'react'

interface AchievementCardProps {
  title?: string
  description?: string
  date?: string
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title = "Ideology Explorer",
  description = "Completed the Ideology Test",
  date = "[date]"
}) => {
  return (
    <div className="flex items-center gap-8 p-6 w-full max-w-md bg-white rounded-3xl shadow-md">
      <div className="relative flex-shrink-0">
        <div 
          className="w-20 h-20 rounded-full"
          style={{ backgroundColor: "#55BCB3" }}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
            style={{ backgroundColor: "#2D3436" }}
          >
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
              style={{ backgroundColor: "#FF7675" }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-500">Obtained on {date}</p>
      </div>
    </div>
  )
}

export default AchievementCard