import { getXataClient } from "@/lib/database/xata";
import { SignJWT, jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Create secret for JWT tokens
const secret = new TextEncoder().encode(JWT_SECRET);

// Verify session token
async function verifyToken(token: string) {
  try {
    if (!token || typeof token !== "string") {
      console.error("Invalid token format");
      return null;
    }

    const verified = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    // Validate payload structure
    const payload = verified.payload;
    if (!payload || typeof payload !== "object") {
      console.error("Invalid payload structure");
      return null;
    }

    // Ensure required fields exist and are of correct type
    if (!payload.address || typeof payload.address !== "string") {
      console.error("Missing or invalid address in payload");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token verification failed:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}

// GET handler for session verification
export async function GET(req: NextRequest) {
  try {
    // Get session token
    const sessionToken = req.cookies.get("session")?.value || "";
    const siweVerified = req.cookies.get("siwe_verified")?.value || "false";

    // Early return if no session token
    if (!sessionToken) {
      return NextResponse.json(
        {
          isAuthenticated: false,
          isRegistered: false,
          isVerified: false,
          error: "No session found",
        },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // Verify token
    const decoded = await verifyToken(sessionToken);
    if (!decoded || !decoded.address) {
      console.error("Token verification failed or missing address");
      return NextResponse.json(
        {
          isAuthenticated: false,
          isRegistered: false,
          isVerified: false,
          error: "Invalid session",
        },
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // Check if user exists in database
    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      wallet_address: (decoded.address as string).toLowerCase(),
    }).getFirst();

    if (!user) {
      console.error("User not found in database");
      return NextResponse.json(
        {
          isAuthenticated: false,
          isRegistered: false,
          isVerified: false,
          error: "User not found",
          address: decoded.address,
        },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // Determine registration status
    const isRegistered = user.name !== "Temporary";

    // Ensure all fields are serializable
    const responseData = {
      address: decoded.address?.toString() || "",
      isAuthenticated: true,
      isRegistered: Boolean(isRegistered),
      isVerified: user.verified,
      isSiweVerified: siweVerified === "true",
      needsRegistration: !isRegistered,
      userId: user.user_id?.toString() || "",
      userUuid: user.user_uuid?.toString() || "",
      user: {
        id: user.xata_id?.toString() || "",
        name: user.name?.toString() || "",
        email: user.email?.toString() || "",
        walletAddress: decoded.address?.toString() || "",
      },
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      {
        isAuthenticated: false,
        isRegistered: false,
        isVerified: false,
        error: "Session verification failed",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

// POST handler for session creation
export async function POST(req: NextRequest) {
  try {
    const { walletAddress, isSiweVerified } = await req.json();
    const xata = getXataClient();

    // Find user by wallet address
    const user = await xata.db.Users.filter(
      "wallet_address",
      walletAddress,
    ).getFirst();
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is registered (not temporary)
    const isRegistered = user.name !== "Temporary";

    // Create session token
    const token = await new SignJWT({
      sub: user.xata_id,
      name: user.name,
      email: user.email,
      walletAddress: user.wallet_address,
      address: user.wallet_address,
      isRegistered,
      isSiweVerified,
      isVerified: user.verified,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    // Create response with session data
    const response = NextResponse.json({
      sub: user.xata_id,
      name: user.name,
      email: user.email,
      walletAddress: user.wallet_address,
      address: user.wallet_address,
      isAuthenticated: true,
      isRegistered,
      isSiweVerified,
      isVerified: user.verified,
      isNewRegistration: !isRegistered,
      needsRegistration: !isRegistered,
      user,
      userId: user.xata_id,
      userUuid: user.user_uuid,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    // Set cookies
    response.cookies.set("session", token, cookieOptions);
    response.cookies.set(
      "siwe_verified",
      isSiweVerified ? "true" : "false",
      cookieOptions,
    );
    response.cookies.set(
      "registration_status",
      isRegistered ? "complete" : "pending",
      cookieOptions,
    );

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
