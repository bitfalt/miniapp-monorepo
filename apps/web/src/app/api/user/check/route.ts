import { getXataClient } from "@/lib/database/xata";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface CheckUserResponse {
  exists: boolean;
  userId?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress } = body as { walletAddress: string };

    if (!walletAddress) {
      const response: CheckUserResponse = {
        exists: false,
        error: "Wallet address is required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const xata = getXataClient();
    const existingUser = await xata.db.Users.filter({
      wallet_address: walletAddress.toLowerCase(),
      name: { $isNot: "Temporary" },
    }).getFirst();

    const response: CheckUserResponse = {
      exists: !!existingUser,
      userId: existingUser?.xata_id,
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: CheckUserResponse = {
      exists: false,
      error: error instanceof Error ? error.message : "Failed to check user existence",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
