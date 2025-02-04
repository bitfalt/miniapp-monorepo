import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/fetch-pay-amount:
 *   get:
 *     summary: Get subscription price amount
 *     description: Retrieves the current subscription price in WORLD tokens
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: Successfully retrieved subscription price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   format: float
 *                   example: 3.5
 *       404:
 *         description: Price not found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    const xata = getXataClient();
    
    // Get the subscription price
    const priceRecord = await xata.db.SubscriptionPrice.getFirst();

    if (!priceRecord) {
      return NextResponse.json(
        { error: "Price not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      amount: priceRecord.world_amount
    });

  } catch (error) {
    console.error("Error fetching subscription price:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription price" },
      { status: 500 }
    );
  }
}
