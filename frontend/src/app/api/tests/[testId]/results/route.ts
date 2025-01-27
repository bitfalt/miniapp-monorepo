import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

interface CategoryScore {
  category_xata_id: string;
  score: number;
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
export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    // TODO: Remove this once we have a proper auth system
    const session = await getServerSession();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const xata = getXataClient();
    
    // Get user
    const user = await xata.db.Users.filter({ email: userEmail }).getFirst();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get test progress
    const progress = await xata.db.UserTestProgress.filter({
      "user.xata_id": user.xata_id,
      "test.test_id": parseInt(params.testId)
    }).getFirst();

    if (!progress) {
      return NextResponse.json(
        { error: "Test progress not found" },
        { status: 404 }
      );
    }

    if (!progress.score) {
      return NextResponse.json(
        { error: "Test not completed" },
        { status: 400 }
      );
    }

    // Get all categories with their names
    const categories = await xata.db.Categories.getAll();
    
    // Map scores to categories
    const categoryScores: CategoryScore[] = [
      { category_xata_id: categories.find(c => c.category_name === "Economic")?.xata_id || "", score: progress.score.economic },
      { category_xata_id: categories.find(c => c.category_name === "Civil")?.xata_id || "", score: progress.score.civil },
      { category_xata_id: categories.find(c => c.category_name === "Diplomatic")?.xata_id || "", score: progress.score.diplomatic },
      { category_xata_id: categories.find(c => c.category_name === "Societal")?.xata_id || "", score: progress.score.societal }
    ].filter(cs => cs.category_xata_id !== "");

    // Process each category score
    const results = [];
    const test = await xata.db.Tests.filter({ test_id: parseInt(params.testId) }).getFirst();

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    for (const categoryScore of categoryScores) {
      // Find matching insight based on score
      const insight = await xata.db.Insights.filter({
        "category.xata_id": categoryScore.category_xata_id,
        lower_limit: { $le: categoryScore.score },
        upper_limit: { $gt: categoryScore.score }
      }).getFirst();

      if (insight) {
        // Get category details
        const category = categories.find(c => c.xata_id === categoryScore.category_xata_id);
        
        if (category) {
          // Save to InsightsPerUserCategory
          const latestInsight = await xata.db.InsightsPerUserCategory
            .sort("insight_user_id", "desc")
            .getFirst();
          const nextInsightId = (latestInsight?.insight_user_id || 0) + 1;

          await xata.db.InsightsPerUserCategory.create({
            category: category.xata_id,
            insight: insight.xata_id,
            test: test.xata_id,
            user: user.xata_id,
            description: insight.insight,
            percentage: categoryScore.score,
            insight_user_id: nextInsightId
          });

          // Add to results
          results.push({
            category: category.category_name,
            insight: insight.insight,
            description: insight.insight,
            percentage: categoryScore.score
          });
        }
      }
    }

    // Update progress status to completed
    await progress.update({
      status: "completed",
      completed_at: new Date()
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error("Error processing test results:", error);
    return NextResponse.json(
      { error: "Failed to process test results" },
      { status: 500 }
    );
  }
}
