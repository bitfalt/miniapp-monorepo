import { getXataClient } from "@/lib/database/xata";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface Insight {
  category?: string;
  percentage?: number;
  description?: string;
  insight?: string;
  left_label?: string;
  right_label?: string;
}

interface InsightResponse {
  insights?: Insight[];
  error?: string;
}

/**
 * @swagger
 * /api/insights/{testId}:
 *   get:
 *     summary: Get insights for a specific test
 *     description: Retrieves all insights for a test, organized by category
 *     parameters:
 *       - name: testId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved test insights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insights:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       left_percentage:
 *                         type: number
 *                       right_percentage:
 *                         type: number
 *                       description:
 *                         type: string
 *                       insight:
 *                         type: string
 *       400:
 *         description: Invalid test ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Test, user, or insights not found
 *       500:
 *         description: Internal server error
 */

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(
  _request: NextRequest,
  { params }: { params: { testId: string } },
) {
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

      // Validate test ID
      const testId = Number.parseInt(params.testId, 10);
      if (Number.isNaN(testId) || testId <= 0) {
        const response: InsightResponse = { error: "Invalid test ID" };
        return NextResponse.json(response, { status: 400 });
      }

      // Get test
      const test = await xata.db.Tests.filter({ test_id: testId }).getFirst();
      if (!test) {
        const response: InsightResponse = { error: "Test not found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Get insights for this test
      const userInsights = await xata.db.InsightsPerUserCategory.filter({
        "user.xata_id": user.xata_id,
        "test.test_id": testId,
      })
        .select([
          "category.category_name",
          "insight.insight",
          "percentage",
          "description",
          "category.right_label",
          "category.left_label",
        ])
        .getMany();

      if (!userInsights.length) {
        const response: InsightResponse = {
          error: "No insights found for this test",
        };
        return NextResponse.json(response, { status: 404 });
      }

      // Transform and organize insights
      const insights = userInsights
        .map((record) => ({
          category: record.category?.category_name,
          percentage: record.percentage,
          description: record.description,
          insight: record.insight?.insight,
          left_label: record.category?.left_label,
          right_label: record.category?.right_label,
        }))
        .filter((insight) => insight.category && insight.insight); // Filter out any incomplete records

      const response: InsightResponse = { insights };
      return NextResponse.json(response);
    } catch {
      const response: InsightResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching test insights:", error);
    const response: InsightResponse = { error: "Internal server error" };
    return NextResponse.json(response, { status: 500 });
  }
}
