import { getXataClient } from "@/lib/utils";
import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
	address?: string;
}

interface Score {
	econ: number;
	dipl: number;
	govt: number;
	scty: number;
}

interface ProgressResponse {
	currentQuestion?: number;
	answers?: Record<string, unknown>;
	scores?: Score;
	message?: string;
	error?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(
	request: NextRequest,
	{ params }: { params: { testId: string } },
) {
	try {
		const xata = getXataClient();
		const token = cookies().get("session")?.value;

		if (!token) {
			const response: ProgressResponse = { error: "Unauthorized" };
			return NextResponse.json(response, { status: 401 });
		}

		try {
			const { payload } = await jwtVerify(token, secret);
			const typedPayload = payload as TokenPayload;

			if (!typedPayload.address) {
				const response: ProgressResponse = { error: "Invalid session" };
				return NextResponse.json(response, { status: 401 });
			}

			const user = await xata.db.Users.filter({
				wallet_address: typedPayload.address,
			}).getFirst();

			if (!user) {
				const response: ProgressResponse = { error: "User not found" };
				return NextResponse.json(response, { status: 404 });
			}

			// Get test progress
			const progress = await xata.db.UserTestProgress.filter({
				"user.xata_id": user.xata_id,
				"test.test_id": Number.parseInt(params.testId, 10),
			})
				.select(["*", "current_question.question_id"])
				.getFirst();

			if (!progress) {
				const response: ProgressResponse = {
					currentQuestion: 0,
					answers: {},
					scores: { econ: 0, dipl: 0, govt: 0, scty: 0 },
				};
				return NextResponse.json(response);
			}

			const response: ProgressResponse = {
				currentQuestion: progress.current_question?.question_id || 0,
				answers: progress.answers || {},
				scores: progress.score || { econ: 0, dipl: 0, govt: 0, scty: 0 },
			};
			return NextResponse.json(response);
		} catch {
			const response: ProgressResponse = { error: "Invalid session" };
			return NextResponse.json(response, { status: 401 });
		}
	} catch (error) {
		console.error("Error fetching progress:", error);
		const response: ProgressResponse = { error: "Failed to fetch progress" };
		return NextResponse.json(response, { status: 500 });
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { testId: string } },
) {
	try {
		const xata = getXataClient();
		const token = cookies().get("session")?.value;

		if (!token) {
			const response: ProgressResponse = { error: "Unauthorized" };
			return NextResponse.json(response, { status: 401 });
		}

		const { payload } = await jwtVerify(token, secret);
		const typedPayload = payload as TokenPayload;

		if (!typedPayload.address) {
			const response: ProgressResponse = { error: "Invalid session" };
			return NextResponse.json(response, { status: 401 });
		}

		const user = await xata.db.Users.filter({
			wallet_address: typedPayload.address,
		}).getFirst();

		if (!user) {
			const response: ProgressResponse = { error: "User not found" };
			return NextResponse.json(response, { status: 404 });
		}

		const body = await request.json();
		const { questionId, answer, currentQuestion, scores } = body;

		// Get or create progress record
		let progress = await xata.db.UserTestProgress.filter({
			"user.xata_id": user.xata_id,
			"test.test_id": Number.parseInt(params.testId, 10),
		}).getFirst();

		// Get the current question record
		const questionRecord = await xata.db.Questions.filter({
			question_id: currentQuestion,
		}).getFirst();

		if (!questionRecord) {
			const response: ProgressResponse = { error: "Question not found" };
			return NextResponse.json(response, { status: 404 });
		}

		if (!progress) {
			const test = await xata.db.Tests.filter({
				test_id: Number.parseInt(params.testId, 10),
			}).getFirst();

			if (!test) {
				const response: ProgressResponse = { error: "Test not found" };
				return NextResponse.json(response, { status: 404 });
			}

			progress = await xata.db.UserTestProgress.create({
				user: { xata_id: user.xata_id },
				test: { xata_id: test.xata_id },
				answers: { [questionId]: answer },
				score: scores,
				status: "in_progress",
				started_at: new Date(),
				current_question: { xata_id: questionRecord.xata_id },
			});
		} else {
			await progress.update({
				answers: {
					...(progress.answers as Record<string, unknown>),
					[questionId]: answer,
				},
				score: scores,
				current_question: { xata_id: questionRecord.xata_id },
			});
		}

		const response: ProgressResponse = {
			message: "Progress saved successfully",
		};
		return NextResponse.json(response);
	} catch (error) {
		console.error("Error saving progress:", error);
		const response: ProgressResponse = { error: "Failed to save progress" };
		return NextResponse.json(response, { status: 500 });
	}
}
