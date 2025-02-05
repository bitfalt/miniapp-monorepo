import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
	address?: string;
}

interface PaymentResponse {
	id?: string;
	error?: string;
}

/**
 * @swagger
 * /api/initiate-payment:
 *   post:
 *     summary: Initiate a new payment
 *     description: Creates a new payment record and links it to the user
 *     tags:
 *       - Payments
 *     security:
 *       - NextAuth: []
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The payment UUID
 *                   example: "a1b2c3d4e5f6g7h8i9j0"
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST() {
	try {
		const xata = getXataClient();
		const token = cookies().get("session")?.value;

		if (!token) {
			const response: PaymentResponse = { error: "Unauthorized" };
			return NextResponse.json(response, { status: 401 });
		}

		try {
			const { payload } = await jwtVerify(token, secret);
			const typedPayload = payload as TokenPayload;

			if (!typedPayload.address) {
				const response: PaymentResponse = { error: "Invalid session" };
				return NextResponse.json(response, { status: 401 });
			}

			const user = await xata.db.Users.filter({
				wallet_address: typedPayload.address,
			}).getFirst();

			if (!user) {
				const response: PaymentResponse = { error: "User not found" };
				return NextResponse.json(response, { status: 404 });
			}

			// Generate payment UUID
			const uuid = crypto.randomUUID().replace(/-/g, "");

			// Get the latest payment_id
			const latestPayment = await xata.db.Payments.sort(
				"payment_id",
				"desc",
			).getFirst();
			const nextPaymentId = (latestPayment?.payment_id || 0) + 1;

			// Create payment record
			await xata.db.Payments.create({
				payment_id: nextPaymentId,
				uuid: uuid,
				user: user.xata_id,
			});

			// Set cookie for frontend
			cookies().set({
				name: "payment-nonce",
				value: uuid,
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
				maxAge: 3600, // 1 hour expiry
			});

			if (process.env.NODE_ENV === "development") {
				console.log("Payment nonce generated:", uuid);
			}

			const response: PaymentResponse = { id: uuid };
			return NextResponse.json(response);
		} catch {
			const response: PaymentResponse = { error: "Invalid session" };
			return NextResponse.json(response, { status: 401 });
		}
	} catch (error) {
		console.error("Error initiating payment:", error);
		const response: PaymentResponse = { error: "Failed to initiate payment" };
		return NextResponse.json(response, { status: 500 });
	}
}
