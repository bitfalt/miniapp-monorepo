'use client'

import { FilledButton } from "./FilledButton"
import Image from "next/image"
import { useState } from "react"

interface WorldIDButtonProps {
  onClick: () => Promise<void>
  className?: string
}

export function WorldIDButton({ onClick, className }: WorldIDButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FilledButton
      variant="default"
      size="lg"
      className={`relative bg-brand-secondary hover:bg-brand-secondary/90 transform transition-all duration-300 hover:scale-[1.02] ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6">
          <Image
            src="/world-id-logo.svg"
            alt="World ID Logo"
            width={24}
            height={24}
            className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
        <span className="font-bold">
          {isLoading ? 'Connecting...' : 'Continue with World ID'}
        </span>
      </div>
    </FilledButton>
  )
} 