import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  needsRegistration: boolean;
  walletAddress: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isRegistered: false,
    needsRegistration: false,
    walletAddress: null,
    loading: true
  });
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth checks on auth-related pages
  const shouldSkipAuthCheck = pathname === '/register' || 
                            pathname === '/sign-in' || 
                            pathname === '/welcome';

  const checkAuth = useCallback(async () => {
    // Skip auth check on auth-related pages
    if (shouldSkipAuthCheck) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    console.log('Checking auth state...');
    try {
      // Check session first
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!sessionResponse.ok) {
        if (sessionResponse.status === 401) {
          setAuthState({
            isAuthenticated: false,
            isRegistered: false,
            needsRegistration: false,
            walletAddress: null,
            loading: false
          });
          if (pathname !== '/sign-in') {
            router.replace('/sign-in');
          }
          return;
        }
        throw new Error('Session check failed');
      }

      const sessionData = await sessionResponse.json();
      console.log('Session check response:', sessionData);

      setAuthState({
        isAuthenticated: sessionData.isAuthenticated,
        isRegistered: sessionData.isRegistered,
        needsRegistration: sessionData.needsRegistration,
        walletAddress: sessionData.address,
        loading: false
      });

      // Handle redirects based on auth state
      if (!sessionData.isAuthenticated && pathname !== '/sign-in') {
        router.replace('/sign-in');
      } else if (sessionData.needsRegistration && pathname !== '/register') {
        router.replace('/register');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error instanceof DOMException && error.name === 'SyntaxError') {
        console.log('Session error detected');
        if (pathname !== '/sign-in' && pathname !== '/welcome') {
          router.replace('/sign-in');
        }
      }
      
      setAuthState({
        isAuthenticated: false,
        isRegistered: false,
        needsRegistration: false,
        walletAddress: null,
        loading: false
      });
    }
  }, [pathname, router, shouldSkipAuthCheck]);

  // Initial auth check
  useEffect(() => {
    if (!shouldSkipAuthCheck) {
      checkAuth();
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [checkAuth, shouldSkipAuthCheck]);

  // Recheck auth when window gains focus (only on protected pages)
  useEffect(() => {
    if (shouldSkipAuthCheck) return;

    const handleFocus = () => {
      console.log('Window focused, rechecking auth...');
      checkAuth();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkAuth, shouldSkipAuthCheck]);

  // Recheck auth periodically (only on protected pages)
  useEffect(() => {
    if (shouldSkipAuthCheck) return;

    const interval = setInterval(() => {
      console.log('Periodic auth check...');
      checkAuth();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAuth, shouldSkipAuthCheck]);

  return {
    ...authState,
    refreshAuth: checkAuth
  };
} 