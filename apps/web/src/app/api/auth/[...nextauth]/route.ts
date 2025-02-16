import { getXataClient } from "@/lib/database/xata";
import { type NextRequest, NextResponse } from "next/server";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  subscription: boolean;
  verified: boolean;
}

// Helper function to get user from headers
async function getUserFromHeaders(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const walletAddress = req.headers.get("x-wallet-address");

  if (!userId || !walletAddress) {
    return null;
  }

  const xata = getXataClient();
  return await xata.db.Users.filter({
    wallet_address: walletAddress,
    xata_id: userId,
  }).getFirst();
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromHeaders(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authUser: AuthUser = {
      id: user.xata_id,
      name: user.name,
      email: user.email,
      walletAddress: user.wallet_address,
      subscription: user.subscription,
      verified: user.verified,
    };

    return NextResponse.json({ user: authUser }, { status: 200 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
