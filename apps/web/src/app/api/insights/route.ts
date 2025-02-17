import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface Test {
  test_id: number;
  test_name?: string;
}

interface InsightResponse {
  tests?: Test[];
  error?: string;
}

/**
 * @swagger
 * /api/insights:
 *   get:
 *     summary: Get tests with insights
 *     description: Retrieves a list of tests that have insights for the user
 *     responses:
 *       200:
 *         description: Successfully retrieved tests with insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       test_id:
 *                         type: number
 *                       test_name:
 *                         type: string
 *       401:
 *         description: Unauthorized
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

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const xata = getXataClient();
    const token = cookies().get("session")?.value;

    if (!token) {
      const response: InsightResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: InsightResponse = { error: "Invalid session" };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: InsightResponse = { error: "User not found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Get distinct tests from InsightsPerUserCategory
      const testsWithInsights = await xata.db.InsightsPerUserCategory.filter({
        "user.xata_id": user.xata_id,
      })
        .select(["test.test_id", "test.test_name"])
        .getMany();

      // Create a map to store unique tests
      const uniqueTests = new Map<number, Test>();

      for (const insight of testsWithInsights) {
        if (insight.test?.test_id) {
          uniqueTests.set(insight.test.test_id, {
            test_id: insight.test.test_id,
            test_name: insight.test.test_name,
          });
        }
      }

      const response: InsightResponse = {
        tests: Array.from(uniqueTests.values()),
      };
      return NextResponse.json(response);
    } catch {
      const response: InsightResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching insights:", error);
    const response: InsightResponse = { error: "Failed to fetch insights" };
    return NextResponse.json(response, { status: 500 });
  }
}
