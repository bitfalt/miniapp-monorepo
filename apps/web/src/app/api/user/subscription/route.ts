import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface SubscriptionResponse {
  next_payment_date?: string;
  isPro: boolean;
  message?: string;
  error?: string;
}

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/user/subscription:
 *   get:
 *     summary: Get user's subscription expiration date
 *     description: Retrieves the user's subscription expiration date in a human-readable format
 *     responses:
 *       200:
 *         description: Successfully retrieved subscription date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 next_payment_date:
 *                   type: string
 *                   format: date
 *                   example: "2024-03-25"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found or no subscription
 *       500:
 *         description: Internal server error
 */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET() {
  try {
    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      const response: SubscriptionResponse = {
        error: "Unauthorized",
        isPro: false,
      };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: SubscriptionResponse = {
          error: "Invalid session",
          isPro: false,
        };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: SubscriptionResponse = {
          error: "User not found",
          isPro: false,
        };
        return NextResponse.json(response, { status: 404 });
      }

      if (!user.subscription_expires) {
        const response: SubscriptionResponse = {
          message: "No active subscription found",
          isPro: false,
        };
        return NextResponse.json(response);
      }

      // Format the date to YYYY-MM-DD
      const nextPaymentDate = user.subscription_expires
        .toISOString()
        .split("T")[0];

      const response: SubscriptionResponse = {
        next_payment_date: nextPaymentDate,
        isPro: true,
      };
      return NextResponse.json(response);
    } catch {
      const response: SubscriptionResponse = {
        error: "Invalid session",
        isPro: false,
      };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching subscription:", error);
    const response: SubscriptionResponse = {
      error: "Internal server error",
      isPro: false,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
