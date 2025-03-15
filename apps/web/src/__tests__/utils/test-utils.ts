/**
 * Test utilities for authentication and sign-in testing
 */

/**
 * Simulates a delay in milliseconds
 * @param ms Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a mock response object for testing
 * @param status HTTP status code
 * @param data Response data
 * @param headers Response headers
 */
export function createMockResponse<T>(
  status: number, 
  data: T, 
  headers: Record<string, string> = {}
): Response {
  const response = {
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers(headers),
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response;
  
  return response;
}

/**
 * Creates a mock error response
 * @param status HTTP status code
 * @param message Error message
 */
export function createMockErrorResponse(
  status: number, 
  message: string
): Response {
  return createMockResponse(
    status, 
    { error: message, message, status: 'error' }
  );
}

/**
 * Mocks the localStorage and sessionStorage APIs
 */
export function setupStorageMocks(): void {
  const storageMock = () => {
    let storage: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in storage ? storage[key] : null),
      setItem: (key: string, value: string) => (storage[key] = value),
      removeItem: (key: string) => delete storage[key],
      clear: () => (storage = {}),
      length: 0,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      key: (_index: number) => null,
    };
  };

  Object.defineProperty(window, 'localStorage', {
    value: storageMock(),
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: storageMock(),
    writable: true,
  });
}

/**
 * Sets up cookie mocking
 */
export function setupCookieMocks(): void {
  let cookies: string[] = [];
  
  Object.defineProperty(document, 'cookie', {
    get: () => cookies.join('; '),
    set: (value: string) => {
      const [cookiePart] = value.split(';');
      const [name, val] = cookiePart.split('=');
      
      // Remove existing cookie with same name if exists
      cookies = cookies.filter(c => !c.startsWith(`${name}=`));
      
      // Add new cookie
      cookies.push(`${name}=${val}`);
    },
    configurable: true,
  });
  
  // Add method to clear cookies for testing
  (document as { clearCookies?: () => void }).clearCookies = () => {
    cookies = [];
  };
}

/**
 * Mocks the fetch API for testing
 * @param mockResponses Map of URL patterns to mock responses
 */
export function mockFetch(
  mockResponses: Record<string, Response | (() => Response)>
): void {
  global.fetch = jest.fn((url: string) => {
    // Find matching URL pattern
    const matchingPattern = Object.keys(mockResponses).find(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(url);
      }
      return url === pattern;
    });
    
    if (matchingPattern) {
      const mockResponse = mockResponses[matchingPattern];
      return Promise.resolve(
        typeof mockResponse === 'function' ? mockResponse() : mockResponse
      );
    }
    
    // Default response for unmatched URLs
    return Promise.resolve(
      createMockErrorResponse(404, `No mock response for ${url}`)
    );
  }) as jest.Mock;
}

/**
 * Sets up all mocks needed for authentication testing
 */
export function setupAuthTestingEnvironment(): void {
  setupStorageMocks();
  setupCookieMocks();
}

/**
 * Cleans up the testing environment
 */
export function cleanupAuthTestingEnvironment(): void {
  jest.restoreAllMocks();
  (document as { clearCookies?: () => void }).clearCookies?.();
} 