'use client'

import Script from 'next/script'
import type { ReactNode } from 'react'

interface WeglotProviderProps {
  children: ReactNode
}

export function WeglotProvider({ children }: WeglotProviderProps) {
  if (!process.env.NEXT_PUBLIC_WEGLOT_API_KEY) {
    console.warn('Missing NEXT_PUBLIC_WEGLOT_API_KEY environment variable')
    return <>{children}</>
  }

  return (
    <>
      <Script
        id="weglot-js"
        src="https://cdn.weglot.com/weglot.min.js"
        strategy="beforeInteractive"
      />
      <Script
        id="weglot-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            Weglot.initialize({
              api_key: "${process.env.NEXT_PUBLIC_WEGLOT_API_KEY}",
            });
          `
        }}
      />
      {children}
    </>
  )
}