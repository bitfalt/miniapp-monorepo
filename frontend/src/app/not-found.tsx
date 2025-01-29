"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
    return (
      <div className="min-h-screen bg-[#2C5154] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Error Badge */}
          <div
            className="bg-[#2C5154]/40 backdrop-blur-sm text-white px-6 py-2 rounded-full inline-block
            border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-700 flex items-center gap-2"
            aria-label="Error Badge"
          >
            <svg className="w-5 h-5 text-[#E36C59]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Error 404
          </div>
  
          {/* Main Content Card */}
          <div
            className="bg-[#2C5154]/40 backdrop-blur-sm border border-white/10 shadow-xl p-8 rounded-3xl
            animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
          >
            <div className="space-y-6">
              <div className="flex justify-center">
                <svg
                  className="w-24 h-24 text-[#E36C59] animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
  
              <h1 className="text-4xl font-bold text-white tracking-tight">Page Not Found</h1>
  
              <p className="text-lg text-white/80 max-w-sm mx-auto">
                Oops! This page has embarked on an unexpected adventure. Let's help you find your way back!
              </p>
  
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-[#E36C59] hover:bg-[#E36C59]/90 text-white font-medium px-8 py-4 h-auto 
                  rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto"
                aria-label="Go to Home"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Home
              </button>
            </div>
          </div>
  
          {/* Visual Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#E36C59]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#E36C59]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    );
}
  
  