import { getXataClient } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface InstructionResponse {
	description?: string;
	total_questions?: number;
	error?: string;
}

/**
 * @swagger
 * /api/tests/{testId}/instructions:
 *   get:
 *     summary: Get test instructions
 *     description: Retrieves the description and total number of questions for a specific test
 *     tags:
 *       - Tests
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the test
 *     responses:
 *       200:
 *         description: Test instructions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                   example: "This test will evaluate your personality traits..."
 *                 total_questions:
 *                   type: number
 *                   example: 20
 *       404:
 *         description: Test not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { testId: string } },
) {
	try {
		const xata = getXataClient();
		// Validate testId
		const testId = Number.parseInt(params.testId, 10);
		if (Number.isNaN(testId) || testId <= 0) {
			const response: InstructionResponse = { error: "Invalid test ID" };
			return NextResponse.json(response, { status: 400 });
		}

		// Get test details and total questions count
		const test = await xata.db.Tests.filter({
			test_id: testId,
		}).getFirst();

		if (!test) {
			const response: InstructionResponse = { error: "Test not found" };
			return NextResponse.json(response, { status: 404 });
		}

		const response: InstructionResponse = {
			description: test.test_description,
			total_questions: test.total_questions,
		};
		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching test instructions:", error);
		const response: InstructionResponse = {
			error: "Failed to fetch test instructions",
		};
		return NextResponse.json(response, { status: 500 });
	}
}
