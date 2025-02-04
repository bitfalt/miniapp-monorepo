import { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { payload } = (await req.json()) as IRequestPayload;
    console.log('Received payment confirmation payload:', payload);
    
    const xata = getXataClient();
    let user;

    // Get token from cookies
    const token = cookies().get('session')?.value;
    
    if (!token) {
      console.log('No session token found');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload: tokenPayload } = await jwtVerify(token, secret);
      console.log('Token payload:', tokenPayload);
      
      if (tokenPayload.address) {
        user = await xata.db.Users.filter({ 
          wallet_address: tokenPayload.address 
        }).getFirst();
        console.log('Found user:', user?.xata_id);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    try {
      // Get the latest payment_id
      const latestPayment = await xata.db.Payments.sort('payment_id', 'desc').getFirst();
      const nextPaymentId = (latestPayment?.payment_id || 0) + 1;

      // Create payment record first
      const paymentRecord = await xata.db.Payments.create({
        payment_id: nextPaymentId,
        user: user.xata_id,
        uuid: payload.transaction_id
      });

      console.log('Created payment record:', paymentRecord);

      // Check if user already has an active subscription
      if (user.subscription && user.subscription_expires && new Date(user.subscription_expires) > new Date()) {
        // Extend the existing subscription
        const newExpiryDate = new Date(user.subscription_expires);
        newExpiryDate.setDate(newExpiryDate.getDate() + 30);
        
        await xata.db.Users.update(user.xata_id, {
          subscription_expires: newExpiryDate
        });
        
        console.log('Extended subscription to:', newExpiryDate);
        
        return NextResponse.json({ 
          success: true,
          message: "Subscription extended",
          next_payment_date: newExpiryDate.toISOString().split('T')[0]
        });
      }

      // Update user's subscription status for new subscription
      const subscriptionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      await xata.db.Users.update(user.xata_id, {
        subscription: true,
        subscription_expires: subscriptionExpiry
      });
      
      console.log('Activated new subscription until:', subscriptionExpiry);

      return NextResponse.json({ 
        success: true,
        message: "Subscription activated",
        next_payment_date: subscriptionExpiry.toISOString().split('T')[0]
      });
      
    } catch (error) {
      console.error('Database operation failed:', error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

