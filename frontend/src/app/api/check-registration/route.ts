import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/utils";
import { createHash } from "crypto";

const xata = getXataClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    console.log('Checking registration for userId:', userId);
    
    if (!userId) {
      throw new Error('UserId is required');
    }
    
    const existingUser = await xata.db.Users.filter({
      $any: [
        { email: userId },
        { wallet_address: userId },
        { user_uuid: userId }
      ]
    }).getFirst();
    console.log('Existing user found:', existingUser);

    if (existingUser) {
      return NextResponse.json({ 
        isRegistered: true,
        user: existingUser
      });
    }

    // Create new user if wallet address is provided
    if (userId.startsWith('0x')) {
      // Get the latest user_id
      const latestUser = await xata.db.Users.sort('user_id', 'desc').getFirst();
      const nextUserId = (latestUser?.user_id || 0) + 1;
      
      // Generate user_uuid from wallet address
      const userUuid = createHash('sha256').update(userId).digest('hex');

      // Create minimal user record
      const countryRecord = await xata.db.Countries.filter({ country_name: "Costa Rica" }).getFirst();
      await xata.db.Users.create({
        wallet_address: userId,
        user_id: nextUserId,
        user_uuid: userUuid,
        created_at: new Date(),
        updated_at: new Date(),
        subscription: false,
        verified: false,
        name: "Temporary",
        last_name: "Temporary",
        email: `${userUuid.slice(0, 8)}@temp.com`,
        country: countryRecord?.xata_id,
      });
    }

    return NextResponse.json({ 
      isRegistered: false 
    });
  } catch (error) {
    console.error('Failed to check registration:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check registration' },
      { status: 500 }
    );
  }
} 