"use client";

import {
    MiniKit,
    VerificationLevel,
    ISuccessResult,
    MiniAppVerifyActionErrorPayload,
    IVerifyResponse,
  } from "@worldcoin/minikit-js";
  import { useCallback, useState } from "react";
  
  export type VerifyCommandInput = {
    action: string;
    signal?: string;
    verification_level?: VerificationLevel;
  };
  
  const verifyPayload: VerifyCommandInput = {
    action: process.env.NEXT_PUBLIC_ACTION_ID || "test-action",
    signal: "",
    verification_level: VerificationLevel.Orb,
  };
  
  export const VerifyBlock = () => {
    const [handleVerifyResponse, setHandleVerifyResponse] = useState<
      MiniAppVerifyActionErrorPayload | IVerifyResponse | null
    >(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleVerify = useCallback(async () => {
      if (!MiniKit.isInstalled()) {
        setError("MiniKit is not installed");
        return null;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
  
        if (finalPayload.status === "error") {
          setError("Command error");
          setHandleVerifyResponse(finalPayload);
          return finalPayload;
        }
  
        const verifyResponse = await fetch('/api/verify', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload as ISuccessResult,
            action: verifyPayload.action,
            signal: verifyPayload.signal,
          }),
        });
  
        const verifyResponseJson = await verifyResponse.json();
        setHandleVerifyResponse(verifyResponseJson);
  
        if (verifyResponseJson.status === 200) {
          console.log("Verification success!", finalPayload);
        } else {
          setError("Verification failed");
        }
  
        return verifyResponseJson;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Verification failed";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-bold">Verify Block</h1>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Test Verify"}
        </button>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        {handleVerifyResponse && !error && (
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(handleVerifyResponse, null, 2)}
          </pre>
        )}
      </div>
    );
  };
  