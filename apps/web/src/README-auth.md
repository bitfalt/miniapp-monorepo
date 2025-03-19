# Authentication Flow Documentation

This document outlines the authentication flow in the MindVault application, focusing on the improvements made to ensure robustness, especially with language preferences.

## Authentication Flow

The authentication flow consists of the following steps:

1. **User visits sign-in page**
   - Language preference is stored in localStorage and cookies
   - Any existing session is cleared

2. **User initiates authentication with WorldID**
   - The app fetches a nonce from `/api/nonce`
   - MiniKit.walletAuth is called with the nonce
   - **Important**: The SIWE message statement is always in English regardless of UI language preference
   - The signed message is verified via `/api/complete-siwe`
   - User existence is checked via `/api/user/check`
   - If the user exists, a session is created via `/api/auth/session`
   - If the user doesn't exist, they are redirected to registration

3. **Session Management**
   - The session is stored in cookies
   - The session is verified on each request via middleware
   - Protected routes redirect to sign-in if no valid session exists

## Improvements for Robustness

We've made several improvements to make the authentication flow more robust:

### 1. Enhanced Error Handling

- Added detailed error logging throughout the authentication flow
- Implemented retry mechanisms for network errors and signature verification failures
- Added fallback mechanisms for when signature verification fails
- Improved error messages to be more user-friendly

### 2. Language Preference Preservation

- Ensured language preference is preserved throughout the authentication process
- Added language preference headers to all API requests
- Added language preference cookies to all API responses
- Implemented fallback mechanisms for language preference retrieval

### 3. Retry Mechanisms

- Added retry mechanisms for wallet authentication
- Added retry mechanisms for SIWE verification
- Added retry mechanisms for session verification
- Added retry mechanisms for database operations
- Implemented exponential backoff for retries

### 4. Testing

- Added comprehensive tests for the authentication flow
- Created test utilities for mocking authentication components
- Added tests for language preference preservation
- Added tests for error handling and recovery

## Key Components

### Sign-In Page (`apps/web/src/app/sign-in/page.tsx`)

The sign-in page handles the user authentication flow, including:
- Clearing existing sessions
- Fetching nonces
- Initiating wallet authentication
- Verifying signatures
- Creating sessions
- Redirecting to appropriate pages

### Middleware (`apps/web/src/middleware.ts`)

The middleware handles session verification and route protection, including:
- Checking for valid session tokens
- Redirecting to sign-in for protected routes
- Preserving language preferences during redirects
- Adding user information to API request headers

### Session API (`apps/web/src/app/api/auth/session/route.ts`)

The session API handles session creation and verification, including:
- Verifying session tokens
- Retrieving user information from the database
- Creating session tokens
- Preserving language preferences

### SIWE Verification (`apps/web/src/app/api/complete-siwe/route.ts`)

The SIWE verification API handles signature verification, including:
- Verifying nonces
- Verifying signatures
- Extracting wallet addresses
- Preserving language preferences

### Logout API (`apps/web/src/app/api/auth/logout/route.ts`)

The logout API handles session termination, including:
- Clearing session cookies
- Redirecting to sign-in
- Preserving language preferences

## Best Practices

1. **Always preserve language preferences**
   - Include language preference in all API requests
   - Set language preference cookies in all API responses
   - Restore language preference after operations

2. **Implement retry mechanisms**
   - Use retry mechanisms for network operations
   - Implement exponential backoff for retries
   - Set appropriate retry limits

3. **Handle errors gracefully**
   - Log detailed error information
   - Provide user-friendly error messages
   - Implement fallback mechanisms

4. **Test thoroughly**
   - Test with different languages
   - Test error scenarios
   - Test recovery mechanisms

## Troubleshooting Authentication Issues

If you encounter authentication issues, check the following:

1. **SIWE Message Language**: The SIWE message statement is always in English ("Sign in with your Ethereum wallet") regardless of the UI language preference. This ensures consistent signature verification across all languages.

2. **Language Preference Headers**: Ensure that the `X-Language-Preference` header is being correctly passed to all API endpoints.

3. **Cookie Handling**: Check that language preference cookies are being preserved during redirects and API calls.

4. **Server Logs**: Look for any errors related to signature verification or nonce mismatches in the server logs.

## Future Improvements

1. Implement more robust session management
2. Add more comprehensive error recovery mechanisms
3. Improve testing coverage
4. Add performance monitoring for authentication flow 