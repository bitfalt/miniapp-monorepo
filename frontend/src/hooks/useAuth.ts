import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  walletAddress: string | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isRegistered: false,
    walletAddress: null,
    loading: true
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/wallet');
        const data = await response.json();

        if (data.address) {
          const regResponse = await fetch('/api/check-registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.address })
          });
          const regData = await regResponse.json();

          setAuthState({
            isAuthenticated: true,
            isRegistered: regData.isRegistered,
            walletAddress: data.address,
            loading: false
          });

          if (!regData.isRegistered) {
            router.push('/register');
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            isRegistered: false,
            walletAddress: null,
            loading: false
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthenticated: false,
          isRegistered: false,
          walletAddress: null,
          loading: false
        });
      }
    };

    checkAuth();
  }, [router]);

  return authState;
} 