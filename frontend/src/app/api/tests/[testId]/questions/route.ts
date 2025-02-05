import { getXataClient } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Question {
	id: number;
	question: string;
	effect: unknown;
}

interface QuestionResponse {
	questions?: Question[];
	error?: string;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { testId: string } },
) {
	try {
		const testId = Number.parseInt(params.testId, 10);

		// Validate the test ID
		if (Number.isNaN(testId) || testId <= 0) {
			const response: QuestionResponse = { error: "Invalid test ID" };
			return NextResponse.json(response, { status: 400 });
		}

		const xata = getXataClient();

		// Fetch all questions for the specified test
		const questions = await xata.db.Questions.filter({ "test.test_id": testId }) // Filter by the test ID
			.select(["question_id", "question", "effect", "sort_order"]) // Select necessary fields
			.sort("sort_order", "asc") // Sort by sort_order
			.getAll();

		// Check if questions were found
		if (!questions || questions.length === 0) {
			const response: QuestionResponse = {
				error: "No questions found for this test",
			};
			return NextResponse.json(response, { status: 404 });
		}

		// Transform the questions to match the expected format
		const formattedQuestions = questions.map((q) => ({
			id: q.question_id,
			question: q.question,
			effect: q.effect, // Use the effect values from the database
		}));

		const response: QuestionResponse = { questions: formattedQuestions };
		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching questions:", error);
		const response: QuestionResponse = { error: "Failed to fetch questions" };
		return NextResponse.json(response, { status: 500 });
	}
}
