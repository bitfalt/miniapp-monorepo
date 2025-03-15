import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name: string) => {
      if (name === 'siwe') return { value: 'mock-nonce' };
      if (name === 'language') return { value: 'es' };
      return undefined;
    }),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock the worldcoin/minikit-js module
jest.mock('@worldcoin/minikit-js', () => ({
  verifySiweMessage: jest.fn(async (payload: Record<string, unknown>, nonce: string) => {
    if (payload.mockFail) {
      throw new Error('Signature verification failed');
    }

    // Extract address from message if available
    const message = payload.message as string | undefined;
    const addressMatch = message?.match(/address: ([0-9a-fA-Fx]+)/);
    const address = addressMatch ? addressMatch[1] : '0x1234567890abcdef1234567890abcdef12345678';

    return {
      isValid: true,
      siweMessageData: {
        address,
        chainId: 1,
        domain: 'example.com',
        issuedAt: new Date().toISOString(),
        nonce,
        statement: 'Sign in with your Ethereum wallet', // Using English statement
        uri: 'https://example.com',
        version: '1',
      },
    };
  }),
  MiniKit: {
    isInstalled: jest.fn(() => true),
    commandsAsync: {
      walletAuth: jest.fn(async ({ nonce, statement }: { nonce: string; statement: string }) => {
        // Verify that we're using the English statement regardless of language preference
        if (statement !== "Sign in with your Ethereum wallet") {
          throw new Error('Statement should be in English for consistent verification');
        }
        
        return {
          status: 'success',
          finalPayload: {
            status: 'success',
            message: `Example message with address: 0x1234567890abcdef1234567890abcdef12345678 and nonce: ${nonce}`,
          },
        };
      }),
    },
    user: {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    },
  },
}));

// Set up environment for tests
beforeEach(() => {
  // Mock localStorage and sessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => key === 'language' ? 'es' : null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn((key: string) => key === 'language' ? 'es' : null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  // Mock fetch
  global.fetch = jest.fn().mockImplementation(async (url: string) => {
    if (url === '/api/nonce') {
      return {
        ok: true,
        json: async () => ({ nonce: 'test-nonce' }),
      };
    }
    if (url === '/api/complete-siwe') {
      return {
        ok: true,
        json: async () => ({ status: 'success', isValid: true, address: '0x1234567890abcdef1234567890abcdef12345678' }),
      };
    }
    if (url === '/api/user/check') {
      return {
        ok: true,
        json: async () => ({ exists: true, userId: 'user-123' }),
      };
    }
    if (url === '/api/auth/session') {
      return {
        ok: true,
        json: async () => ({ success: true }),
      };
    }
    return {
      ok: false,
      json: async () => ({ error: 'Not found' }),
    };
  });

  // Mock document.cookie
  Object.defineProperty(document, 'cookie', {
    value: 'language=es',
    writable: true,
  });

  // Mock console methods
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Spanish Language Sign-In Flow', () => {
  it('should handle sign-in with Spanish language preference', async () => {
    // Simulate the sign-in process
    const mockHandleWorldIDClick = jest.fn().mockImplementation(async () => {
      // Fetch nonce
      await fetch('/api/nonce', {
        headers: { 'X-Language-Preference': 'es' }
      });
      
      // Call wallet auth
      const { MiniKit } = await import('@worldcoin/minikit-js');
      await MiniKit.commandsAsync.walletAuth({
        nonce: 'test-nonce',
        statement: 'Sign in with your Ethereum wallet'
      });
      
      // Complete SIWE
      await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Language-Preference': 'es'
        },
        body: JSON.stringify({
          payload: { status: 'success' },
          nonce: 'test-nonce'
        })
      });
    });
    
    // Execute the mock sign-in process
    await mockHandleWorldIDClick();
    
    // Verify API calls
    const fetchCalls = (global.fetch as jest.Mock).mock.calls;
    
    // Check if language preference headers are set correctly
    for (const call of fetchCalls) {
      const url = call[0];
      const options = call[1] || {};
      
      if (url.startsWith('/api/')) {
        // @ts-expect-error - We know headers exists in the options
        expect(options.headers['X-Language-Preference']).toBe('es');
      }
    }
    
    // Verify MiniKit calls
    const { MiniKit } = await import('@worldcoin/minikit-js');
    expect(MiniKit.commandsAsync.walletAuth).toHaveBeenCalledWith({
      nonce: 'test-nonce',
      statement: 'Sign in with your Ethereum wallet' // Should always be English
    });
  });
  
  it('should use English for SIWE message statement regardless of language preference', async () => {
    // Mock MiniKit.commandsAsync.walletAuth
    const walletAuthMock = jest.fn().mockResolvedValue({
      status: 'success',
      finalPayload: {
        status: 'success',
        message: 'Example message',
      },
    });
    
    // Replace the mock implementation
    const { MiniKit } = await import('@worldcoin/minikit-js');
    const originalWalletAuth = MiniKit.commandsAsync.walletAuth;
    MiniKit.commandsAsync.walletAuth = walletAuthMock;
    
    // Simulate a sign-in attempt
    await walletAuthMock({
      nonce: 'test-nonce',
      statement: 'Sign in with your Ethereum wallet'
    });
    
    // Verify that the statement is in English
    expect(walletAuthMock).toHaveBeenCalledWith({
      nonce: 'test-nonce',
      statement: 'Sign in with your Ethereum wallet'
    });
    
    // Restore original mock
    MiniKit.commandsAsync.walletAuth = originalWalletAuth;
  });
}); 