"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motivationalQuotes } from "@/data/motivationalQuotes"

interface User {
  name: string
  last_name: string
  level: string
  points: number
  maxPoints: number
}

interface ProfileCardProps {
  className?: string
  user?: User
}

const ProfileAvatar = ({ name, lastName }: { name: string; lastName: string }) => {
  const initials = useMemo(() => {
    return `${name[0]}${lastName[0]}`.toUpperCase()
  }, [name, lastName])

  return (
    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white shadow-lg">
      <AvatarFallback className="bg-white text-brand-secondary text-lg sm:text-xl font-bold">{initials}</AvatarFallback>
    </Avatar>
  )
}

const LevelProgress = ({ points, maxPoints }: { points: number; maxPoints: number }) => {
  const progress = (points / maxPoints) * 100

  return (
    <div className="w-full max-w-[250px]">
      <div className="relative h-2 rounded-full bg-white/30">
        <div
          className="absolute top-0 left-0 h-full bg-[#E36C59] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          aria-valuenow={points}
          aria-valuemin={0}
          aria-valuemax={maxPoints}
          role="progressbar"
        />
      </div>
      <p className="text-white text-xs font-medium font-spaceGrotesk text-center mt-1">
        {points}/{maxPoints} points to level up
      </p>
    </div>
  )
}

export function ProfileCard({
  className,
  user = {
    name: "John",
    last_name: "Doe",
    level: "Conscious Explorer",
    points: 45,
    maxPoints: 100,
  },
}: ProfileCardProps) {
  const [quote, setQuote] = useState<string>(motivationalQuotes[0])

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

    const intervalId = setInterval(() => {
      setQuote((prevQuote) => {
        let newQuote
        do {
          newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
        } while (newQuote === prevQuote)
        return newQuote
      })
    }, 10000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      className={cn(
        "w-full max-w-[365px] bg-gradient-to-br from-[#387478] to-[#2C5154] rounded-[20px] relative overflow-hidden shadow-lg",
        "transform hover:scale-105 hover:-translate-y-1 hover:rotate-1",
        "shadow-[0_10px_20px_rgba(0,0,0,0.2),_0_6px_6px_rgba(0,0,0,0.25)]",
        "hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]",
        "transition-all duration-300",
        className,
      )}
    >
      <div className="absolute inset-0 bg-black opacity-20 rounded-[20px] transform translate-y-2 blur-md"></div>
      <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center">
        <ProfileAvatar name={user.name} lastName={user.last_name} />

        <div className="mt-4 text-center">
          <h3 className="text-xl sm:text-2xl font-bold font-spaceGrotesk text-white">
            {user.name} {user.last_name}
          </h3>
          <p className="text-white text-sm font-medium font-spaceGrotesk mt-1">Level: {user.level}</p>
        </div>

        <LevelProgress points={user.points} maxPoints={user.maxPoints} />

        <div className="mt-4 w-full">
          <p className="text-white text-sm font-medium font-spaceGrotesk mb-2">Your daily motivation:</p>
          <h2 className="text-accent-red text-lg sm:text-xl font-bold font-spaceGrotesk leading-tight">{quote}</h2>
        </div>
      </div>
    </div>
  )
}