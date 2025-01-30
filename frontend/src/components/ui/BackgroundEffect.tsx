'use client'

interface BackgroundEffectProps {
  variant?: 'default' | 'home' | 'settings' | 'results' | 'signin'
}

export function BackgroundEffect({ variant = 'default' }: BackgroundEffectProps) {
  const effects = {
    default: (
      <>
        <div className="absolute top-0 -left-4 w-[400px] h-[400px] bg-gradient-to-r from-accent-red/30 to-accent-redSoft/30 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 -right-4 w-[400px] h-[400px] bg-gradient-to-l from-accent-blue/30 to-accent-blueSoft/30 rounded-full blur-[80px] -z-10" />
      </>
    ),
    home: (
      <>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-accent-red/20 via-accent-redSoft/20 to-transparent rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-accent-blue/20 via-accent-blueSoft/20 to-transparent rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent-red/10 via-accent-blue/10 to-accent-redSoft/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      </>
    ),
    settings: (
      <>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-accent-blue/30 via-accent-blueSoft/30 to-transparent rounded-full blur-[90px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-red/30 via-accent-redSoft/30 to-transparent rounded-full blur-[90px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-accent-blue/10 via-accent-red/10 to-accent-blueSoft/10 rounded-full blur-[100px] -z-10 animate-pulse" />
      </>
    ),
    results: (
      <>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-accent-blue/20 via-accent-blueSoft/20 to-transparent rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-accent-red/20 via-accent-redSoft/20 to-transparent rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-accent-blue/10 via-accent-red/10 to-accent-blueSoft/10 rounded-full blur-[140px] -z-10 animate-pulse" />
      </>
    ),
    signin: (
      <>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-accent-red/25 via-accent-redSoft/25 to-transparent rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent-blue/25 via-accent-blueSoft/25 to-transparent rounded-full blur-[100px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent-red/15 via-accent-blue/15 to-accent-redSoft/15 rounded-full blur-[120px] -z-10 animate-pulse" />
      </>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {effects[variant]}
    </div>
  )
} 