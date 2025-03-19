import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '../app/api/auth/logout/route';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    delete: jest.fn(),
    get: jest.fn((name) => {
      if (name === 'language') return { value: 'en' };
      return undefined;
    }),
  })),
}));

// Import next/headers for mocking
import * as nextHeaders from 'next/headers';

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

describe('Logout API Route', () => {
  let mockRequest: NextRequest;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a mock request
    mockRequest = {
      headers: new Headers({
        'X-Language-Preference': 'en',
      }),
      cookies: {
        get: jest.fn((name) => {
          if (name === 'language') return { value: 'en' };
          if (name === 'session') return { value: 'test-session' };
          return undefined;
        }),
      },
    } as unknown as NextRequest;
    
    // Mock NextResponse.redirect
    NextResponse.redirect = jest.fn(() => {
      const mockResponse = {
        headers: new Headers(),
      } as unknown as NextResponse;
      
      // Add append method to headers
      mockResponse.headers.append = jest.fn();
      
      return mockResponse;
    });
    
    // Mock NextResponse.json with proper typing
    const originalJson = NextResponse.json;
    NextResponse.json = jest.fn().mockImplementation((body, init) => {
      return originalJson(body, init);
    });
  });
  
  it('should clear cookies on POST request', async () => {
    const response = await POST(mockRequest);
    
    // Check if redirect was called
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/sign-in' }),
      303,
    );
    
    // Check if cookies were cleared
    const cookiesToClear = [
      'session',
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      'worldcoin_verified',
      'siwe_verified',
      'registration_status',
    ];
    
    for (const cookie of cookiesToClear) {
      expect(response.headers.append).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining(`${cookie}=; Path=/; Expires=`),
      );
    }
    
    // Check if language preference was preserved
    expect(response.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('language=en; Path=/; Max-Age=86400'),
    );
  });
  
  it('should clear cookies on GET request', async () => {
    const response = await GET(mockRequest);
    
    // Check if redirect was called
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/sign-in' }),
      303,
    );
    
    // Check if language preference was preserved
    expect(response.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('language=en; Path=/; Max-Age=86400'),
    );
  });
  
  it('should preserve Spanish language preference', async () => {
    // Create a new request with Spanish language preference
    const spanishRequest = {
      ...mockRequest,
      headers: new Headers({
        'X-Language-Preference': 'es',
      }),
      cookies: {
        get: jest.fn((name) => {
          if (name === 'language') return { value: 'es' };
          if (name === 'session') return { value: 'test-session' };
          return undefined;
        }),
      },
    } as unknown as NextRequest;
    
    const response = await POST(spanishRequest);
    
    // Check if language preference was preserved
    expect(response.headers.append).toHaveBeenCalledWith(
      'Set-Cookie',
      expect.stringContaining('language=es; Path=/; Max-Age=86400'),
    );
  });
  
  it('should handle errors gracefully', async () => {
    // Mock an error in the cookies function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookiesMock = (nextHeaders as any).cookies;
    cookiesMock.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    await POST(mockRequest);
    
    // Check if error response was returned
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Failed to logout' },
      { status: 500 },
    );
  });
}); 