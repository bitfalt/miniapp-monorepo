import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import { Question } from "@/app/types";

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    const testId = parseInt(params.testId);
    
    if (isNaN(testId) || testId <= 0) {
      return NextResponse.json(
        { error: "Invalid test ID" },
        { status: 400 }
      );
    }

    const xata = getXataClient();
    
    // First, verify the total questions in the test
    const test = await xata.db.Tests
      .filter({ test_id: testId })
      .getFirst();

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      );
    }

    console.log(`Expected questions for test ${testId}:`, test.total_questions);
    
    // Fetch questions with explicit pagination
    const questions = await xata.db.Questions
      .filter({
        "test.test_id": testId
      })
      .sort("sort_order", "asc")
      .getPaginated({
        pagination: {
          size: 100 // Increase the limit to ensure we get all questions
        }
      });

    console.log(`Actually fetched questions:`, questions.records.length);

    if (!questions.records || questions.records.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this test" },
        { status: 404 }
      );
    }

    // Transform the questions to match the expected format
    const formattedQuestions = questions.records.map(q => ({
      id: q.question_id,
      question: q.question,
      effect: {
        econ: 0, // Add your actual effect values here
        dipl: 0,
        govt: 0,
        scty: 0
      }
    }));

    return NextResponse.json({
      questions: formattedQuestions
    });

  } catch (error) {
    console.error("Error in questions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 