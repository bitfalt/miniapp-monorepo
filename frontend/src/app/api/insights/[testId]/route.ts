import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

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
  throw new Error('JWT_SECRET environment variable is required');
}

export const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
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
    
    // Validate test ID
    const testId = parseInt(params.testId);
    if (Number.isNaN(testId) || testId <= 0) {
      return NextResponse.json(
        { error: "Invalid test ID" },
        { status: 400 }
      );
    }

    // Get test
    const test = await xata.db.Tests.filter({ test_id: testId }).getFirst();
    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    // Get insights for this test
    const userInsights = await xata.db.InsightsPerUserCategory
      .filter({
        "user.xata_id": user.xata_id,
        "test.test_id": testId
      })
      .select([
        "category.category_name",
        "insight.insight",
        "percentage",
        "description",
        "category.right_label",
        "category.left_label"
      ])
      .getMany();

    if (!userInsights.length) {
      return NextResponse.json(
        { error: "No insights found for this test" },
        { status: 404 }
      );
    }

    // Transform and organize insights
    const insights = userInsights.map(record => ({
      category: record.category?.category_name,
      percentage: record.percentage,
      description: record.description,
      insight: record.insight?.insight,
      left_label: record.category?.left_label,
      right_label: record.category?.right_label
    })).filter(insight => insight.category && insight.insight); // Filter out any incomplete records

    return NextResponse.json({
      insights
    });

  } catch (error) {
    console.error("Error fetching test insights:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 