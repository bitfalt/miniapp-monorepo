/**
 * Mock implementation of the @worldcoin/minikit-js package
 */

export enum VerificationLevel {
  Orb = 'orb',
  Device = 'device',
}

export interface MiniAppWalletAuthSuccessPayload {
  status: string;
  message?: string;
  address?: string;
  [key: string]: unknown;
}

export interface ISuccessResult {
  status: string;
  nullifier_hash?: string;
  [key: string]: unknown;
}

export interface VerifyCommandInput {
  action: string;
  verification_level: VerificationLevel;
}

export const MiniKit = {
  isInstalled: () => true,
  commandsAsync: {
    walletAuth: async ({ nonce, statement }: { nonce: string; statement: string }) => {
      return {
        finalPayload: {
          status: 'success',
          message: `${statement}\n\nURI: https://example.com\nVersion: 1\nChain ID: 1\nNonce: ${nonce}\nIssued At: ${new Date().toISOString()}\nExpiration Time: ${new Date(Date.now() + 3600000).toISOString()}\nNot Before: ${new Date().toISOString()}\nRequest ID: mock-request-id\nResources: []\naddress: 0x1234567890abcdef1234567890abcdef12345678`,
        },
      };
    },
    verify: async (input: VerifyCommandInput) => {
      return {
        finalPayload: {
          status: 'success',
          nullifier_hash: '0x1234567890abcdef1234567890abcdef12345678',
          action: input.action,
          verification_level: input.verification_level,
        },
      };
    },
  },
  user: {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  },
};

export async function verifySiweMessage(
  payload: MiniAppWalletAuthSuccessPayload,
  nonce: string
) {
  // Mock implementation that simulates successful verification
  if (payload.mockFail) {
    throw new Error('Signature verification failed');
  }

  // Extract address from message if available
  const addressMatch = payload.message?.match(/address: ([0-9a-fA-Fx]+)/);
  const address = addressMatch ? addressMatch[1] : '0x1234567890abcdef1234567890abcdef12345678';

  return {
    isValid: true,
    siweMessageData: {
      address,
      chainId: 1,
      domain: 'example.com',
      issuedAt: new Date().toISOString(),
      nonce,
      statement: 'Mock SIWE statement',
      uri: 'https://example.com',
      version: '1',
    },
  };
} 