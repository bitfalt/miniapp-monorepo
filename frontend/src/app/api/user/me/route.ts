import { getXataClient } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface UserResponse {
  name?: string;
  lastName?: string;
  email?: string;
  age?: number;
  country?: string;
  walletAddress?: string;
  subscription?: boolean;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  error?: string;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const walletAddress = req.headers.get("x-wallet-address");

    if (!userId || !walletAddress) {
      const response: UserResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      wallet_address: walletAddress,
      xata_id: userId,
    }).getFirst();

    if (!user) {
      const response: UserResponse = { error: "User not found" };
      return NextResponse.json(response, { status: 404 });
    }

    const response: UserResponse = {
      name: user.name?.toString(),
      lastName: user.last_name?.toString(),
      email: user.email?.toString(),
      age: user.age,
      country: user.country?.toString(),
      walletAddress: user.wallet_address?.toString(),
      subscription: user.subscription,
      verified: user.verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    const response: UserResponse = { error: "Failed to fetch user data" };
    return NextResponse.json(response, { status: 500 });
  }
}
