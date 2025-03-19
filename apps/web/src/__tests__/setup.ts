import '@testing-library/jest-dom';

// Mock window.open
window.open = jest.fn();

// Mock MiniKit
jest.mock('@worldcoin/minikit-js', () => ({
  MiniKit: {
    isInstalled: jest.fn().mockReturnValue(true),
    commandsAsync: {
      walletAuth: jest.fn().mockResolvedValue({
        finalPayload: {
          status: 'success',
          message: 'Authentication successful',
        },
      }),
    },
    user: {
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    },
  },
}));

// Mock next/server
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((input) => ({
    url: input || 'https://example.com',
    nextUrl: {
      pathname: '/test',
      searchParams: new URLSearchParams(),
    },
    cookies: {
      get: jest.fn().mockImplementation((name) => ({
        name,
        value: `mock-${name}-value`,
      })),
      set: jest.fn(),
      delete: jest.fn(),
    },
    headers: {
      get: jest.fn().mockImplementation((name) => `mock-${name}-value`),
      set: jest.fn(),
    },
    json: jest.fn(),
    method: 'GET',
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({
      body,
      ...options,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    })),
    redirect: jest.fn().mockImplementation((url) => ({
      url,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    })),
    next: jest.fn().mockImplementation(() => ({
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((name) => ({
      name,
      value: `mock-${name}-value`,
    })),
    set: jest.fn(),
    delete: jest.fn(),
  }),
  headers: jest.fn().mockReturnValue({
    get: jest.fn().mockImplementation((name) => `mock-${name}-value`),
    set: jest.fn(),
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/test'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

// Add a basic test to avoid the "Your test suite must contain at least one test" error
test('setup file is loaded', () => {
  expect(true).toBe(true);
});

// Mock localStorage and sessionStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'language') return 'en';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn((key) => {
      if (key === 'language') return 'en';
      return null;
    }),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn().mockImplementation((url) => {
  if (url === '/api/auth/session') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        isAuthenticated: true,
        isRegistered: true,
        isVerified: false,
      }),
    });
  }
  
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
}) as jest.Mock;

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  value: '',
  writable: true,
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}; 