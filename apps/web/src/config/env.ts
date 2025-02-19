const requiredServerEnvVars = [
  'XATA_DATABASE_URL',
  'NEXTAUTH_SECRET',
  'JWT_SECRET'
] as const;

const requiredPublicEnvVars = [
  'NEXT_PUBLIC_XATA_API_KEY',
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_ENVIRONMENT',
  'NEXT_PUBLIC_WLD_APP_ID'
] as const;

export function validateEnv(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missingServerVars = requiredServerEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  const missingPublicVars = requiredPublicEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  const missingVars = [...missingServerVars, ...missingPublicVars];

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Export validated environment variables
export const env = {
  // Server-side variables
  XATA_DATABASE_URL: process.env.XATA_DATABASE_URL,
  XATA_API_KEY: process.env.XATA_API_KEY || process.env.NEXT_PUBLIC_XATA_API_KEY,
  XATA_BRANCH: process.env.XATA_BRANCH || process.env.NEXT_PUBLIC_XATA_BRANCH || 'main',
  
  // Public variables
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  NEXT_PUBLIC_XATA_API_KEY: process.env.NEXT_PUBLIC_XATA_API_KEY,
  NEXT_PUBLIC_WLD_APP_ID: process.env.NEXT_PUBLIC_WLD_APP_ID
} as const;

// Type for environment variables
export type Env = typeof env; 