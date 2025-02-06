import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
  address?: string;
}

interface CategoryScore {
  category_xata_id: string;
  score: number;
}

interface TestResult {
  category: string;
  insight: string;
  description: string;
  percentage: number;
}

interface ResultResponse {
  results?: TestResult[];
  error?: string;
}

/**
 * @swagger
 * /api/tests/{testId}/results:
 *   get:
 *     summary: Get test results and insights
 *     description: Retrieves test scores and generates insights based on user's answers
 *     parameters:
 *       - name: testId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved test results and insights
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     example: "Economic"
 *                   insight:
 *                     type: string
 *                     example: "You relate more to..."
 *                   description:
 *                     type: string
 *                     example: "Centrist"
 *                   percentage:
 *                     type: number
 *                     example: 40
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Test progress not found
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
      const response: ResultResponse = { error: "Unauthorized" };
      return NextResponse.json(response, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const typedPayload = payload as TokenPayload;

      if (!typedPayload.address) {
        const response: ResultResponse = { error: "Invalid session" };
        return NextResponse.json(response, { status: 401 });
      }

      const user = await xata.db.Users.filter({
        wallet_address: typedPayload.address,
      }).getFirst();

      if (!user) {
        const response: ResultResponse = { error: "User not found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Get test progress
      const progress = await xata.db.UserTestProgress.filter({
        "user.xata_id": user.xata_id,
        "test.test_id": Number.parseInt(params.testId, 10),
      }).getFirst();

      if (!progress) {
        const response: ResultResponse = { error: "Test progress not found" };
        return NextResponse.json(response, { status: 404 });
      }

      if (!progress.score) {
        const response: ResultResponse = { error: "Test not completed" };
        return NextResponse.json(response, { status: 400 });
      }

      // Get all categories with their names
      const categories = await xata.db.Categories.getAll();

      // Map scores to categories
      const categoryScores: CategoryScore[] = [
        {
          category_xata_id:
            categories.find((c) => c.category_name === "Economic")?.xata_id ||
            "",
          score: progress.score.econ,
        },
        {
          category_xata_id:
            categories.find((c) => c.category_name === "Civil")?.xata_id || "",
          score: progress.score.govt,
        },
        {
          category_xata_id:
            categories.find((c) => c.category_name === "Diplomatic")?.xata_id ||
            "",
          score: progress.score.dipl,
        },
        {
          category_xata_id:
            categories.find((c) => c.category_name === "Societal")?.xata_id ||
            "",
          score: progress.score.scty,
        },
      ].filter((cs) => cs.category_xata_id !== "");

      // Process each category score
      const results: TestResult[] = [];
      const test = await xata.db.Tests.filter({
        test_id: Number.parseInt(params.testId, 10),
      }).getFirst();

      if (!test) {
        const response: ResultResponse = { error: "Test not found" };
        return NextResponse.json(response, { status: 404 });
      }

      // Round all scores to integers
      for (const cs of categoryScores) {
        cs.score = Math.round(cs.score);
      }

      for (const categoryScore of categoryScores) {
        // Find matching insight based on score
        const insight = await xata.db.Insights.filter({
          "category.xata_id": categoryScore.category_xata_id,
          lower_limit: { $le: categoryScore.score },
          upper_limit: { $gt: categoryScore.score },
        }).getFirst();

        if (insight) {
          // Get category details
          const category = categories.find(
            (c) => c.xata_id === categoryScore.category_xata_id,
          );

          if (category) {
            // Save to InsightsPerUserCategory
            const latestInsight = await xata.db.InsightsPerUserCategory.sort(
              "insight_user_id",
              "desc",
            ).getFirst();
            const nextInsightId = (latestInsight?.insight_user_id || 0) + 1;

            // Get range description based on score
            let range = "neutral";
            if (categoryScore.score >= 45 && categoryScore.score <= 55) {
              range = "centrist";
            } else if (categoryScore.score >= 35 && categoryScore.score < 45) {
              range = "moderate";
            } else if (categoryScore.score >= 25 && categoryScore.score < 35) {
              range = "balanced";
            }

            await xata.db.InsightsPerUserCategory.create({
              category: category.xata_id,
              insight: insight.xata_id,
              test: test.xata_id,
              user: user.xata_id,
              description: range,
              percentage: categoryScore.score,
              insight_user_id: nextInsightId,
            });

            // Add to results
            results.push({
              category: category.category_name,
              insight: insight.insight,
              description: range,
              percentage: categoryScore.score,
            });
          }
        }
      }

      // Update progress status to completed
      await progress.update({
        status: "completed",
        completed_at: new Date(),
      });

      const response: ResultResponse = { results };
      return NextResponse.json(response);
    } catch {
      const response: ResultResponse = { error: "Invalid session" };
      return NextResponse.json(response, { status: 401 });
    }
  } catch (error) {
    console.error("Error processing test results:", error);
    const response: ResultResponse = {
      error: "Failed to process test results",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
