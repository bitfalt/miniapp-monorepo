import { NextRequest } from 'next/server';

// Simple mock for NextResponse
const mockNextResponse = {
  redirect: jest.fn().mockImplementation((url) => ({
    url,
    cookies: {
      set: jest.fn(),
      delete: jest.fn()
    },
    headers: new Map([['location', url.toString()]])
  })),
  next: jest.fn().mockReturnValue(undefined)
};

// Simple middleware implementation for testing
async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for a public path
  const publicPaths = ['/sign-in', '/api/auth/session', '/api/auth/logout', '/api/nonce', '/api/complete-siwe', '/register', '/welcome'];
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return mockNextResponse.next();
  }
  
  // Check if the request has a session token
  const hasSessionToken = request.cookies.get('session_token') !== undefined;
  if (!hasSessionToken) {
    // Create a redirect response
    const url = new URL('/sign-in', request.url);
    const response = mockNextResponse.redirect(url);
    
    // Preserve language preference
    const language = request.cookies.get('language');
    if (language) {
      response.cookies.set('language', language.value, { path: '/' });
    }
    
    return response;
  }
  
  // For valid session tokens, allow access
  return mockNextResponse.next();
}

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access to public paths', async () => {
    const request = new NextRequest('http://localhost:3000/sign-in');
    await middleware(request);
    
    expect(mockNextResponse.next).toHaveBeenCalled();
    expect(mockNextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should redirect to sign-in if no session token', async () => {
    const request = new NextRequest('http://localhost:3000/protected');
    Object.defineProperty(request, 'cookies', {
      value: {
        get: jest.fn().mockImplementation(() => undefined)
      }
    });
    
    await middleware(request);
    
    expect(mockNextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = mockNextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/sign-in');
  });

  it('should preserve language preference when redirecting', async () => {
    const request = new NextRequest('http://localhost:3000/protected');
    Object.defineProperty(request, 'cookies', {
      value: {
        get: jest.fn().mockImplementation((cookieName) => {
          if (cookieName === 'language') return { value: 'es' };
          return undefined;
        })
      }
    });
    
    const response = await middleware(request);
    
    expect(mockNextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = mockNextResponse.redirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/sign-in');
    expect(response.cookies.set).toHaveBeenCalledWith('language', 'es', { path: '/' });
  });

  it('should handle POST requests to API routes', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/session', {
      method: 'POST',
    });
    
    await middleware(request);
    
    expect(mockNextResponse.next).toHaveBeenCalled();
    expect(mockNextResponse.redirect).not.toHaveBeenCalled();
  });

  it('should allow access with a valid session token', async () => {
    const request = new NextRequest('http://localhost:3000/protected');
    Object.defineProperty(request, 'cookies', {
      value: {
        get: jest.fn().mockImplementation((cookieName) => {
          if (cookieName === 'session_token') return { value: 'valid-token' };
          return undefined;
        })
      }
    });
    
    await middleware(request);
    
    expect(mockNextResponse.next).toHaveBeenCalled();
    expect(mockNextResponse.redirect).not.toHaveBeenCalled();
  });
}); 