import { getXataClient } from "@/lib/utils";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const secret = new TextEncoder().encode(JWT_SECRET);

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

    // Get test progress
    const progress = await xata.db.UserTestProgress.filter({
      "user.xata_id": user.xata_id,
      "test.test_id": parseInt(params.testId)
    }).getFirst();

    if (!progress) {
      return NextResponse.json({
        currentQuestion: 0,
        answers: {},
        scores: { econ: 0, dipl: 0, govt: 0, scty: 0 }
      });
    }

    return NextResponse.json({
      currentQuestion: progress.current_question?.question_id || 0,
      answers: progress.answers || {},
      scores: progress.score || { econ: 0, dipl: 0, govt: 0, scty: 0 }
    });

  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { testId: string } }
) {
  try {
    const xata = getXataClient();
    let user;

    const token = cookies().get('session')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);
    if (payload.address) {
      user = await xata.db.Users.filter({ 
        wallet_address: payload.address 
      }).getFirst();
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { questionId, answer, currentQuestion, scores } = body;

    // Get or create progress record
    let progress = await xata.db.UserTestProgress.filter({
      "user.xata_id": user.xata_id,
      "test.test_id": parseInt(params.testId)
    }).getFirst();

    // Get the current question record
    const questionRecord = await xata.db.Questions.filter({
      question_id: currentQuestion
    }).getFirst();

    if (!questionRecord) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    if (!progress) {
      const test = await xata.db.Tests.filter({ 
        test_id: parseInt(params.testId) 
      }).getFirst();

      if (!test) {
        return NextResponse.json(
          { error: "Test not found" },
          { status: 404 }
        );
      }

      progress = await xata.db.UserTestProgress.create({
        user: { xata_id: user.xata_id },
        test: { xata_id: test.xata_id },
        answers: { [questionId]: answer },
        score: scores,
        status: "in_progress",
        started_at: new Date(),
        current_question: { xata_id: questionRecord.xata_id }
      });
    } else {
      await progress.update({
        answers: { 
          ...progress.answers as object, 
          [questionId]: answer 
        },
        score: scores,
        current_question: { xata_id: questionRecord.xata_id }
      });
    }

    return NextResponse.json({
      message: "Progress saved successfully"
    });

  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
} 