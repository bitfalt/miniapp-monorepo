import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { secret } from "../tests/[testId]/progress/route";

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

    // Get distinct tests from InsightsPerUserCategory
    const testsWithInsights = await xata.db.InsightsPerUserCategory
      .filter({
        "user.xata_id": user.xata_id
      })
      .select([
        "test.test_id",
        "test.test_name"
      ])
      .getMany();

    // Create a map to store unique tests
    const uniqueTests = new Map();
    
    testsWithInsights.forEach(insight => {
      if (insight.test?.test_id) {
        uniqueTests.set(insight.test.test_id, {
          test_id: insight.test.test_id,
          test_name: insight.test.test_name
        });
      }
    });

    return NextResponse.json({
      tests: Array.from(uniqueTests.values())
    });

  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
} 