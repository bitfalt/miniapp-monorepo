import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIES_TO_CLEAR = [
	"session",
	"next-auth.session-token",
	"next-auth.callback-url",
	"next-auth.csrf-token",
] as const;

const COOKIE_EXPIRY = "Thu, 01 Jan 1970 00:00:00 GMT";

export async function POST() {
	try {
		const cookieStore = cookies();

		// Clear all session-related cookies
		for (const cookie of COOKIES_TO_CLEAR) {
			cookieStore.delete(cookie);
		}

		const response = NextResponse.json(
			{
				success: true,
				message: "Logged out successfully",
			},
			{ status: 200 },
		);

		// Set all cookies to expire
		for (const cookie of COOKIES_TO_CLEAR) {
			response.headers.append(
				"Set-Cookie",
				`${cookie}=; Path=/; Expires=${COOKIE_EXPIRY}`,
			);
		}

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
	}
}
