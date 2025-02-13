import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface UserResponse {
  user?: {
    name: string;
    last_name: string;
    verified: boolean;
    level: string;
    points: number;
    maxPoints: number;
  };
  error?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      const response: UserResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: UserResponse = { error: "Invalid session" };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: UserResponse = { error: "User not found" };
        return NextResponse.json(response, { status: 404 });
      }

      const response: UserResponse = {
        user: {
          name: user.name,
          last_name: user.last_name,
          verified: user.verified,
          level: `${user.level} - Coming Soon`,
          points: user.level_points ?? 0,
          maxPoints: 100,
        },
      };

      return NextResponse.json(response);
    } catch {
      const response: UserResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error in home API route:", error);
    const response: UserResponse = { error: "Internal server error" };
    return NextResponse.json(response, { status: 500 });
  }
}
