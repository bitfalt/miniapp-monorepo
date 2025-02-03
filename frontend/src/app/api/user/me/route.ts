import { NextRequest, NextResponse } from 'next/server';
import { getXataClient } from "@/lib/utils";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const xata = getXataClient();
    let user;

    // Get token from cookies
    const token = cookies().get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.address) {
        user = await xata.db.Users.filter({ 
          wallet_address: payload.address 
        }).getFirst();
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
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