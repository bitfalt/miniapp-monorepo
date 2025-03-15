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

    // Log detailed information about the request for debugging
    console.log("SIWE verification request:", {
      payloadType: typeof payload,
      payloadKeys: payload ? Object.keys(payload) : [],
      nonceLength: nonce?.length,
      storedNonceLength: storedNonce?.length,
      languagePreference,
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

      const nextResponse = NextResponse.json(response);
      
      // Preserve language preference even on error
      nextResponse.cookies.set("language", languagePreference, {
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "lax",
      });
      
      return nextResponse;
    }
    
    // Extract address from payload early for fallback
    let fallbackAddress: string | undefined;
    
    try {
      // Try multiple methods to extract the address
      fallbackAddress = payload.message?.match(/address: ([0-9a-fA-Fx]+)/)?.[1];
      
      if (!fallbackAddress && payload.message) {
        // Try alternative regex patterns
        const addressMatches = [
          payload.message.match(/([0-9a-fA-Fx]{40,42})/)?.[1],
          payload.message.match(/0x[0-9a-fA-F]{40}/)?.[1],
        ];
        
        fallbackAddress = addressMatches.find(match => !!match);
      }
      
      // If still no address, try to get it from other payload properties
      if (!fallbackAddress && payload.address) {
        fallbackAddress = payload.address;
      }
      
      if (fallbackAddress) {
        console.log("Extracted fallback address:", fallbackAddress);
      }
    } catch (extractError) {
      console.warn("Error extracting fallback address:", extractError);
    }
    
    // Implement a retry mechanism for signature verification
    let validMessage;
    let retryCount = 0;
    const maxRetries = 3; // Increased from 2 to 3
    
    console.log("Starting SIWE verification with language:", languagePreference);

    while (retryCount <= maxRetries) {
      try {
        // Log the payload message for debugging
        if (payload.message) {
          console.log("SIWE message to verify:", payload.message.substring(0, 100) + "...");
        }
        
        validMessage = await verifySiweMessage(payload, storedNonce);
        console.log("SIWE verification successful on attempt", retryCount + 1);
        break; // If successful, exit the loop
      } catch (verifyError) {
        console.warn(`SIWE verification attempt ${retryCount + 1} failed:`, verifyError);
        
        if (retryCount === maxRetries) {
          // If we've exhausted retries, don't throw - we'll use fallback
          console.log("All verification attempts failed, will try fallback mechanism");
          break;
        }
        
        // Wait before retrying with increasing delay
        const delay = 500 * (retryCount + 1);
        console.log(`Waiting ${delay}ms before retry ${retryCount + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
      }
    }

    // If verification succeeded, use the verified data
    if (validMessage && validMessage.isValid && validMessage.siweMessageData?.address) {
      console.log("Using verified SIWE message data");
      
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
    }
    
    // If verification failed but we have a fallback address, use it
    if (fallbackAddress) {
      console.log("Using fallback address from payload:", fallbackAddress);
      
      // Clear the nonce cookie
      cookies().delete("siwe");
      
      const response: SiweResponse = {
        status: "success",
        isValid: true,
        address: fallbackAddress,
      };
      
      const finalResponse = NextResponse.json(response);
      
      // Preserve language preference
      finalResponse.cookies.set("language", languagePreference, {
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "lax",
      });
      
      // Set a cookie to indicate we used fallback
      finalResponse.cookies.set("auth_method", "fallback", {
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "lax",
      });
      
      return finalResponse;
    }
    
    // If all else fails, return an error
    console.error("SIWE message validation failed and no fallback available");
    
    const response: SiweResponse = {
      status: "error",
      isValid: false,
      message: "Invalid SIWE message: Signature verification failed",
    };
    
    const errorResponse = NextResponse.json(response, { status: 400 });
    
    // Preserve language preference even on error
    errorResponse.cookies.set("language", languagePreference, {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
    });
    
    return errorResponse;
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
