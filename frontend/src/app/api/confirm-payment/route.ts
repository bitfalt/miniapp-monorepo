import { getXataClient } from "@/lib/utils";
import type { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

interface PaymentResponse {
  success?: boolean;
  error?: string;
  message?: string;
  next_payment_date?: string;
  details?: string;
}

interface TokenPayload extends JWTPayload {
  address?: string;
}

function getSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export async function POST(req: NextRequest) {
  try {
    const { payload } = (await req.json()) as IRequestPayload;

    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { payload: tokenPayload } = await jwtVerify(token, getSecret());
      const typedPayload = tokenPayload as TokenPayload;

      if (!typedPayload.address) {
        console.error("No address in token payload");
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Get the latest payment_id
      const latestPayment = await xata.db.Payments.sort(
        "payment_id",
        "desc",
      ).getFirst();
      const nextPaymentId = (latestPayment?.payment_id || 0) + 1;

      // Create payment record
      await xata.db.Payments.create({
        payment_id: nextPaymentId,
        user: user.xata_id,
        uuid: payload.transaction_id,
      });

      // Check if user already has an active subscription
      if (
        user.subscription &&
        user.subscription_expires &&
        new Date(user.subscription_expires) > new Date()
      ) {
        // Extend the existing subscription
        const newExpiryDate = new Date(user.subscription_expires);
        newExpiryDate.setDate(newExpiryDate.getDate() + 30);

        await xata.db.Users.update(user.xata_id, {
          subscription_expires: newExpiryDate,
        });

        const response: PaymentResponse = {
          success: true,
          message: "Subscription extended",
          next_payment_date: newExpiryDate.toISOString().split("T")[0],
        };

        return NextResponse.json(response);
      }

      // Update user's subscription status for new subscription
      const subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await xata.db.Users.update(user.xata_id, {
        subscription: true,
        subscription_expires: subscriptionExpiry,
      });

      const response: PaymentResponse = {
        success: true,
        message: "Subscription activated",
        next_payment_date: subscriptionExpiry.toISOString().split("T")[0],
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error confirming payment:", error);

      const response: PaymentResponse = {
        success: false,
        error: "Failed to confirm payment",
        details: error instanceof Error ? error.message : "Unknown error",
      };

      return NextResponse.json(response, { status: 500 });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);

    const response: PaymentResponse = {
      success: false,
      error: "Failed to confirm payment",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
