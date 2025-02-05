import {
	type MiniAppWalletAuthSuccessPayload,
	verifySiweMessage,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload;
	nonce: string;
}

interface SiweResponse {
	status: "success" | "error";
	isValid: boolean;
	address?: string;
	message?: string;
}

export async function POST(req: NextRequest) {
	try {
		const { payload, nonce } = (await req.json()) as IRequestPayload;
		const storedNonce = cookies().get("siwe")?.value;

		console.log("SIWE verification request:", {
			payload,
			nonce,
			storedNonce,
		});

		if (!storedNonce || storedNonce.trim() !== nonce.trim()) {
			console.error("Nonce mismatch:", {
				received: nonce,
				stored: storedNonce,
				receivedLength: nonce?.length,
				storedLength: storedNonce?.length,
			});

			const response: SiweResponse = {
				status: "error",
				isValid: false,
				message: "Invalid nonce",
			};

			return NextResponse.json(response);
		}

		console.log("Verifying SIWE message...");
		const validMessage = await verifySiweMessage(payload, storedNonce);
		console.log("SIWE verification result:", validMessage);

		if (!validMessage.isValid || !validMessage.siweMessageData?.address) {
			throw new Error("Invalid SIWE message");
		}

		// Clear the nonce cookie after successful verification
		cookies().delete("siwe");

		const response: SiweResponse = {
			status: "success",
			isValid: true,
			address: validMessage.siweMessageData.address,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("SIWE verification error:", error);

		const response: SiweResponse = {
			status: "error",
			isValid: false,
			message:
				error instanceof Error ? error.message : "SIWE verification failed",
		};

		return NextResponse.json(response);
	}
}
