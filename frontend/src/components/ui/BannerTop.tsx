'use client'

import { FilledButton } from './FilledButton'
import { useVerification } from '@/hooks/useVerification'

export function BannerTop() {
  const { isVerifying, isVerified, isLoading, error, handleVerify } = useVerification()

  if (isLoading || isVerified) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-brand-tertiary z-50 px-4 py-2 flex flex-col items-center justify-center">
      {error && (
        <p className="text-red-400 text-xs mb-2">
          {error}
        </p>
      )}
      <FilledButton
        variant="default"
        size="sm"
        className="w-full bg-[#e36c59] hover:bg-[#e36c59]/90 text-sm"
        onClick={handleVerify}
        disabled={isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify your World ID'}
      </FilledButton>
    </div>
  )
}
