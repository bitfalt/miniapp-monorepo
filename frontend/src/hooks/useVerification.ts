'use client'

import { useState, useEffect, useCallback } from 'react'
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'
import { useRouter } from 'next/navigation'

// Utility function to clear verification session data
export const clearVerificationSession = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('verify-modal-shown')
  }
}

export function useVerification() {
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false)
  const router = useRouter()

  const clearVerificationSession = useCallback(() => {
    setIsVerified(false)
    setIsVerifying(false)
    setError(null)
    // Clear session cookies
    document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'worldcoin_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'siwe_verified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'registration_status=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }, [])

  const checkVerificationStatus = useCallback(async () => {
    console.log('Checking verification status...')
    setError(null)
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          clearVerificationSession()
          router.push('/sign-in')
          return
        }
        throw new Error('Failed to check verification status')
      }

      const data = await response.json()
      console.log('Verification status:', data)

      setIsVerified(data.isVerified)
      
      // Handle registration and authentication states
      if (!data.isAuthenticated) {
        clearVerificationSession()
        router.push('/sign-in')
        return
      }

      if (!data.isRegistered) {
        router.push('/register')
        return
      }

    } catch (error) {
      console.error('Error in checkVerificationStatus:', error)
      if (error instanceof DOMException) {
        console.log('DOMException caught, clearing session...')
        clearVerificationSession()
        router.push('/sign-in')
        return
      }
      setError(error instanceof Error ? error.message : 'Failed to check verification status')
    } finally {
      setIsLoading(false)
      setHasCheckedInitial(true)
    }
  }, [router, clearVerificationSession])

  // Initial check on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Initial verification check')
      checkVerificationStatus()
    }
  }, [checkVerificationStatus])

  const handleVerify = async () => {
    console.log('Starting verification process...')
    setError(null)
    if (!MiniKit.isInstalled()) {
      setError('World App is not installed')
      window.open('https://worldcoin.org/download-app', '_blank')
      return false
    }

    setIsVerifying(true)
    try {
      const verifyPayload: VerifyCommandInput = {
        action: 'verify-user',
        verification_level: VerificationLevel.Orb,
      }

      console.log('Requesting World ID verification...')
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)
        .catch(error => {
          if (error instanceof DOMException) {
            console.log('World ID verification cancelled by user')
            throw new Error('Verification cancelled')
          }
          throw error
        })

      if (finalPayload.status === 'error') {
        console.error('World ID verification failed:', finalPayload)
        setError('Verification failed')
        return false
      }

      console.log('Verifying proof with backend...')
      const verifyResponse = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          payload: finalPayload as ISuccessResult,
          action: 'verify-user'
        }),
      })

      const verifyResponseJson = await verifyResponse.json()
      console.log('Backend verification response:', verifyResponseJson)
      
      if (verifyResponse.ok) {
        setIsVerified(true)
        setError(null)
        await checkVerificationStatus()
        return true
      }

      if (verifyResponse.status === 401) {
        clearVerificationSession()
        router.push('/sign-in')
      }
      
      setError(verifyResponseJson.error || 'Verification failed')
      return false
    } catch (error) {
      console.error('Verification error:', error)
      if (error instanceof Error && error.message === 'Verification cancelled') {
        setError('Verification was cancelled')
      } else {
        setError('Verification failed')
      }
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    isVerified,
    isVerifying,
    isLoading,
    error,
    hasCheckedInitial,
    handleVerify,
    checkVerificationStatus,
    refreshVerification: checkVerificationStatus
  }
} 