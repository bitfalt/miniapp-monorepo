import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET() {
	const token = cookies().get("session")?.value;

	if (!token) {
		return NextResponse.json({ address: null });
	}

	try {
		const { payload } = await jwtVerify(token, secret);
		return NextResponse.json({ address: payload.address });
	} catch {
		// Clear invalid session cookie
		cookies().delete("session");
		return NextResponse.json({ address: null });
	}
}
