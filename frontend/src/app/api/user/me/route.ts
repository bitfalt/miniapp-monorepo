import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const walletAddress = req.headers.get('x-wallet-address');

    if (!userId || !walletAddress) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      wallet_address: walletAddress,
      xata_id: userId
    }).getFirst();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        id: user.xata_id,
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        age: user.age,
        country: user.country,
        walletAddress: user.wallet_address,
        subscription: user.subscription,
        verified: user.verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch user data' }),
      { status: 500 }
    );
  }
} 