import { getXataClient } from "@/lib/utils";
import { verifyCloudProof } from "@worldcoin/minikit-js";
import type { ISuccessResult, IVerifyResponse } from "@worldcoin/minikit-js";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

interface VerifyResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: unknown;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * @swagger
 * /api/verify:
 *   post:
 *     summary: Verify a World ID proof
 *     description: |
 *       Verifies a World ID proof and updates the user's verification status.
 *       This endpoint will:
 *       1. Verify user authentication via session token
 *       2. Validate the World ID proof
 *       3. Update user verification status if action is 'verify-user'
 *     tags:
 *       - Authentication
 *     security:
 *       - SessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payload
 *               - action
 *             properties:
 *               payload:
 *                 type: object
 *                 required:
 *                   - merkle_root
 *                   - nullifier_hash
 *                   - proof
 *                   - verification_level
 *                 properties:
 *                   merkle_root:
 *                     type: string
 *                     description: The merkle root of the World ID group
 *                   nullifier_hash:
 *                     type: string
 *                     description: The nullifier hash for the proof
 *                   proof:
 *                     type: string
 *                     description: The ZK proof
 *                   verification_level:
 *                     type: string
 *                     enum: [orb, device]
 *                     description: The level of verification (Orb or Device)
 *               action:
 *                 type: string
 *                 description: The action being verified
 *                 example: "verify-user"
 *               signal:
 *                 type: string
 *                 description: Optional signal string for the verification
 *     responses:
 *       200:
 *         description: Verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: string
 *                   example: "success"
 *                 detail:
 *                   type: string
 *                   example: "Verification successful"
 *       400:
 *         description: Bad request - Invalid payload or verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *                 details:
 *                   type: object
 *                   description: Additional error details from verification
 *       401:
 *         description: Unauthorized - No valid session token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
export async function POST(req: NextRequest) {
  try {
    const { payload, action, signal } = (await req.json()) as IRequestPayload;
    const rawAppId = process.env.NEXT_PUBLIC_WLD_APP_ID;

    if (!rawAppId?.startsWith("app_")) {
      const response: VerifyResponse = {
        success: false,
        error: "Invalid app_id configuration",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const app_id = rawAppId as `app_${string}`;

    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action,
      signal,
    )) as IVerifyResponse;

    if (!verifyRes.success) {
      const response: VerifyResponse = {
        success: false,
        error: "Verification failed",
        details: verifyRes,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      const response: VerifyResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload: tokenPayload } = await jwtVerify(token, secret);
      const typedPayload = tokenPayload as TokenPayload;

      if (!typedPayload.address) {
        const response: VerifyResponse = { error: "Invalid session" };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: VerifyResponse = { error: "User not found" };
        return NextResponse.json(response, { status: 404 });
      }

      await xata.db.Users.update(user.xata_id, {
        verified: true,
        updated_at: new Date().toISOString(),
      });

      const response: VerifyResponse = {
        success: true,
        message: "Verification successful",
      };
      return NextResponse.json(response);
    } catch {
      const response: VerifyResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    const response: VerifyResponse = { error: "Internal server error" };
    return NextResponse.json(response, { status: 500 });
  }
}
