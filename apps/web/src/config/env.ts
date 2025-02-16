export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_XATA_API_KEY: process.env.NEXT_PUBLIC_XATA_API_KEY,
  NEXT_PUBLIC_XATA_BRANCH: process.env.NEXT_PUBLIC_XATA_BRANCH || 'main',
} as const

// Type for environment variables
export type Env = typeof env

// Validate environment variables
export function validateEnv(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
    'NEXT_PUBLIC_XATA_API_KEY',
  ] as const

  for (const envVar of requiredEnvVars) {
    if (!env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
} 