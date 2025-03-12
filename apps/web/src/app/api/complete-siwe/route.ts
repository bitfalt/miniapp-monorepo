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
    // Get language preference from header or cookie
    const languageHeader = req.headers.get("X-Language-Preference");
    const languageCookie = req.cookies.get("language")?.value;
    const languagePreference = languageHeader || languageCookie || "en";
    
    const { payload, nonce } = (await req.json()) as IRequestPayload;
    const storedNonce = cookies().get("siwe")?.value;

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

      const nextResponse = NextResponse.json(response);
      
      // Preserve language preference even on error
      nextResponse.cookies.set("language", languagePreference, {
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "lax",
      });
      
      return nextResponse;
    }
    const validMessage = await verifySiweMessage(payload, storedNonce);

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

    const finalResponse = NextResponse.json(response);
    
    // Preserve language preference even on success
    finalResponse.cookies.set("language", languagePreference, {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
    });
    
    return finalResponse;
  } catch (error) {
    console.error("SIWE verification error:", error);

    // Get language preference from header or cookie (in case of error)
    let languagePreference = "en";
    try {
      const languageHeader = req.headers.get("X-Language-Preference");
      const languageCookie = req.cookies.get("language")?.value;
      languagePreference = languageHeader || languageCookie || "en";
    } catch (e) {
      console.error("Error getting language preference:", e);
    }

    const response: SiweResponse = {
      status: "error",
      isValid: false,
      message:
        error instanceof Error ? error.message : "SIWE verification failed",
    };

    const finalResponse = NextResponse.json(response);
    
    // Preserve language preference even on error
    finalResponse.cookies.set("language", languagePreference, {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
    });
    
    return finalResponse;
  }
}
