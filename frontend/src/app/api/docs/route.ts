import { getApiDocs } from "@/lib/swagger";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const docs = getApiDocs();
		return NextResponse.json(docs);
	} catch (error) {
		console.error("Failed to get API docs:", error);
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
