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
    // Get language preference from headers or cookies
    const languagePreference = req.headers.get("x-language-preference") || 
                              req.cookies.get("language")?.value || 
                              "en";
    
    const body = await req.json();
    const { walletAddress } = body as { walletAddress: string };

    if (!walletAddress) {
      const response: CheckUserResponse = {
        exists: false,
        error: "Wallet address is required",
      };
      const jsonResponse = NextResponse.json(response, { status: 400 });
      
      // Preserve language preference cookie
      jsonResponse.cookies.set("language", languagePreference, {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
        sameSite: "lax",
      });
      
      return jsonResponse;
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
    
    const jsonResponse = NextResponse.json(response);
    
    // Preserve language preference cookie
    jsonResponse.cookies.set("language", languagePreference, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    });
    
    return jsonResponse;
  } catch (error) {
    // Try to get language preference even in case of error
    let languagePreference = "en";
    try {
      languagePreference = req.headers.get("x-language-preference") || 
                          req.cookies.get("language")?.value || 
                          "en";
    } catch (e) {
      console.error("Error getting language preference:", e);
    }
    
    const response: CheckUserResponse = {
      exists: false,
      error: error instanceof Error ? error.message : "Failed to check user existence",
    };
    
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
