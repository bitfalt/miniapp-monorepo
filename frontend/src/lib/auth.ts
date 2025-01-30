import { NextRequest } from 'next/server';
import { getXataClient } from './utils';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  subscription: boolean;
  verified: boolean;
}

export async function getCurrentUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const userId = req.headers.get('x-user-id');
    const walletAddress = req.headers.get('x-wallet-address');

    if (!userId || !walletAddress) {
      return null;
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      wallet_address: walletAddress,
      xata_id: userId
    }).getFirst();

    if (!user) {
      return null;
    }

    return {
      id: user.xata_id,
      name: user.name,
      email: user.email,
      walletAddress: user.wallet_address,
      subscription: user.subscription,
      verified: user.verified
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
} 