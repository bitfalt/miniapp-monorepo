/* eslint-disable */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.test file
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Ensure JWT_SECRET is set for tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret';
}

// Define required environment variables with default values for tests
const requiredEnvVars = {
  NEXT_PUBLIC_MINIKIT_APP_ID: 'app_test_123456789',
  NEXT_PUBLIC_MINIKIT_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_MINIKIT_REDIRECT_URL: 'http://localhost:3000/sign-in',
  NEXT_PUBLIC_MINIKIT_NETWORK: 'testnet',
  NEXT_PUBLIC_MINIKIT_CHAIN_ID: '1',
};

// Set default values for required environment variables if not already set
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

// Export for testing purposes
module.exports = {
  setupTestEnv: () => {
    return {
      ...process.env
    };
  }
};
/* eslint-enable */ 