import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
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

// Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Create secret for JWT tokens
const secret = new TextEncoder().encode(JWT_SECRET);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get language preference from headers or cookies
    const languagePreference = req.headers.get("x-language-preference") || 
                           req.cookies.get("language")?.value || 
                           "en";
    
    // Try to get user ID and wallet address from headers
    let userId = req.headers.get("x-user-id");
    let walletAddress = req.headers.get("x-wallet-address");

    // If headers are not present, try to get from session cookie
    if (!userId || !walletAddress) {
      const sessionToken = req.cookies.get("session")?.value;
      
      if (sessionToken) {
        try {
          const { payload } = await jwtVerify(sessionToken, secret);
          if (payload && typeof payload === 'object' && 'sub' in payload && 'address' in payload) {
            userId = payload.sub as string;
            walletAddress = payload.address as string;
          }
        } catch (error) {
          console.error("Error verifying session token:", error);
        }
      }
    }

    // If we still don't have user ID or wallet address, return unauthorized
    if (!userId || !walletAddress) {
      const response: UserResponse = { error: "Unauthorized" };
      const jsonResponse = NextResponse.json(response, { status: 401 });
      
      // Preserve language preference cookie
      jsonResponse.cookies.set("language", languagePreference, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      
      return jsonResponse;
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      wallet_address: walletAddress,
    }).getFirst();

    if (!user) {
      const response: UserResponse = { error: "User not found" };
      const jsonResponse = NextResponse.json(response, { status: 404 });
      
      // Preserve language preference cookie
      jsonResponse.cookies.set("language", languagePreference, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      
      return jsonResponse;
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
    
    const jsonResponse = NextResponse.json(response);
    
    // Preserve language preference cookie
    jsonResponse.cookies.set("language", languagePreference, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });
    
    return jsonResponse;
  } catch (error) {
    console.error("Error fetching user:", error);
    
    // Try to get language preference even in case of error
    let languagePreference = "en";
    try {
      languagePreference = req.headers.get("x-language-preference") || 
                          req.cookies.get("language")?.value || 
                          "en";
    } catch (e) {
      console.error("Error getting language preference:", e);
    }
    
    const response: UserResponse = { error: "Failed to fetch user data" };
    const jsonResponse = NextResponse.json(response, { status: 500 });
    
    // Preserve language preference cookie
    jsonResponse.cookies.set("language", languagePreference, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });
    
    return jsonResponse;
  }
}
