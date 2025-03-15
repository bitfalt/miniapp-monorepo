import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

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

export async function GET(req: NextRequest) {
  try {
    // Get language preference from headers or cookies
    const languagePreference = req.headers.get("x-language-preference") || 
                           req.cookies.get("language")?.value || 
                           "en";
    
    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
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

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: UserResponse = { error: "Invalid session" };
        const jsonResponse = NextResponse.json(response, { status: 401 });
        
        // Preserve language preference cookie
        jsonResponse.cookies.set("language", languagePreference, {
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
          sameSite: "lax",
        });
        
        return jsonResponse;
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
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
        user: {
          name: user.name,
          last_name: user.last_name,
          verified: user.verified,
          level: `${user.level} - Coming Soon`,
          points: user.level_points ?? 0,
          maxPoints: 100,
        },
      };

      const jsonResponse = NextResponse.json(response);
      
      // Preserve language preference cookie
      jsonResponse.cookies.set("language", languagePreference, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      
      return jsonResponse;
    } catch {
      const response: UserResponse = { error: "Invalid session" };
      const jsonResponse = NextResponse.json(response, { status: 401 });
      
      // Preserve language preference cookie
      jsonResponse.cookies.set("language", languagePreference, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      
      return jsonResponse;
    }
  } catch (error) {
    console.error("Error in home API route:", error);
    
    // Try to get language preference even in case of error
    let languagePreference = "en";
    try {
      languagePreference = req.headers.get("x-language-preference") || 
                          req.cookies.get("language")?.value || 
                          "en";
    } catch (e) {
      console.error("Error getting language preference:", e);
    }
    
    const response: UserResponse = { error: "Internal server error" };
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
