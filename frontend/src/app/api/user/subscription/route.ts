import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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
  throw new Error('JWT_SECRET environment variable is required');
}

export const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(request: Request) {
  try {
    const xata = getXataClient();
    let user;

    // Get token from cookies
    const token = cookies().get('session')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.address) {
        user = await xata.db.Users.filter({ 
          wallet_address: payload.address 
        }).getFirst();
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.subscription_expires) {
      return NextResponse.json(
        { 
          message: "No active subscription found",
          isPro: false
        }
      );
    }

    // Format the date to YYYY-MM-DD
    const nextPaymentDate = user.subscription_expires.toISOString().split('T')[0];

    return NextResponse.json({
      next_payment_date: nextPaymentDate,
      isPro: true
    });

  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 