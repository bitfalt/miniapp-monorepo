"use client"

import { cn } from "@/lib/utils"

interface ProfileCardProps {
  className?: string;
}

export function ProfileCard({ className }: ProfileCardProps) {
  return (
    <div className={cn(
      "w-[365px] h-[230px] bg-brand-secondary rounded-[20px] relative overflow-hidden shadow-lg",
      className
    )}>
      <div className="p-4">
        <p className="text-white text-xs font-medium font-spaceGrotesk">
          Hello! Let's see your progress...
        </p>
        <h2 className="text-white text-[32px] font-medium font-spaceGrotesk leading-[40px]">
          Daily Motivation
        </h2>
      </div>

      <div className="px-6 flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-brand-tertiary flex items-center justify-center">
            <div className="w-[61px] h-[61px] rounded-full bg-white relative">
              <div className="w-[35px] h-[35px] rounded-full bg-brand-secondary absolute -right-3 top-0" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-white">
            <h3 className="text-[32px] font-medium font-spaceGrotesk leading-[50px]">
              John Doe
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="h-6 w-6 text-accent-orange"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M10 2c0 -.88 1.056 -1.331 1.692 -.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08 .174l.012 .003c.625 .133 1.203 -.43 2.303 -2.173l.14 -.224a1 1 0 0 1 1.582 -.153c1.334 1.435 2.601 4.377 2.601 6.27c0 4.265 -3.591 7.705 -8 7.705s-8 -3.44 -8 -7.706c0 -2.252 1.022 -4.716 2.632 -6.301l.605 -.589c.241 -.236 .434 -.43 .618 -.624c1.43 -1.512 2.145 -2.924 2.145 -4.78" />
            </svg>
            <span className="text-2xl font-medium font-spaceGrotesk">4</span>
          </div>
          
          <p className="text-white text-xs font-medium font-spaceGrotesk mb-2">
            Level: Conscious Explorer
          </p>
          
          <div className="relative">
            <div 
              className="w-[201px] h-1.5 rounded-full bg-white"
            />
            
            <div className="absolute top-0 left-0 w-[201px] h-1.5 bg-base-white rounded-full">
              <div 
                className="h-full bg-neutral-grey rounded-full transition-all duration-300"
                style={{ width: '45%' }}
              />
            </div>
            
            <p className="text-white text-[10px] font-medium font-spaceGrotesk text-center mt-1">
              45/100 points to level up
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
