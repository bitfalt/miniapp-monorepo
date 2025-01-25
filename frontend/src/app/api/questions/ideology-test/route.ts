import { getXataClient } from "@/lib/xata";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const xata = getXataClient();

    // Fetch all questions for the ideology test
    const questions = await xata.db.Questions
      .filter({ test: { test_id: 1 } }) // Assuming test_id 1 is the ideology test
      .select(["question_id", "question", "effect"]) // Fetch the entire effect object
      .getAll();

    // Map the questions to include the effect fields
    const formattedQuestions = questions.map((question) => ({
      question_id: question.question_id,
      question: question.question,
      effect: question.effect, // Use the entire effect object
    }));

    return NextResponse.json({ questions: formattedQuestions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}