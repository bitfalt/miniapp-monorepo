import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface CelebrityResponse {
  celebrity?: string;
  error?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * @swagger
 * /api/public-figures:
 *   get:
 *     summary: Get user's celebrity match
 *     description: Retrieves the user's current celebrity match from their latest test results
 *     tags:
 *       - Celebrity
 *     security:
 *       - SessionCookie: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's celebrity match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 celebrity:
 *                   type: string
 *                   example: "Elon Musk"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or celebrity match not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      const response: CelebrityResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: CelebrityResponse = { error: "Invalid session" };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: CelebrityResponse = { error: "User not found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Get user's latest ideology
      const userIdeology = await xata.db.IdeologyPerUser.filter({
        "user.xata_id": user.xata_id,
      })
        .sort("ideology_user_id", "desc")
        .select(["ideology.xata_id"])
        .getFirst();

      if (!userIdeology?.ideology?.xata_id) {
        const response: CelebrityResponse = { error: "No ideology found for user" };
        return NextResponse.json(response, { status: 404 });
      }

      // Get all public figures with matching ideology
      const matchingFigures = await xata.db.PublicFigures.filter({
        "ideology.xata_id": userIdeology.ideology.xata_id,
      }).getMany();

      if (!matchingFigures.length) {
        const response: CelebrityResponse = { error: "No matching public figures found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Randomly select one matching public figure
      const randomIndex = Math.floor(Math.random() * matchingFigures.length);
      const selectedFigure = matchingFigures[randomIndex];

      const response: CelebrityResponse = { celebrity: selectedFigure.name };
      return NextResponse.json(response);
    } catch {
      const response: CelebrityResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error finding celebrity match:", error);
    const response: CelebrityResponse = { error: "Failed to find celebrity match" };
    return NextResponse.json(response, { status: 500 });
  }
}
