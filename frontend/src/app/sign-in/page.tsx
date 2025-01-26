"use client";

import { signIn } from "next-auth/react";
import { FilledButton } from "@/components/ui/FilledButton";
import { Wallet, Chrome } from "lucide-react";
import { OutlinedButton } from "@/components/ui/OutlinedButton";
import { useSearchParams, useRouter } from "next/navigation";
import { MiniKit } from '@worldcoin/minikit-js';
import { useState } from 'react';

export default function SignIn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleWorldIDClick = async () => {
    try {
      setError(null);
      
      if (!MiniKit.isInstalled()) {
        router.push("https://worldcoin.org/download-app");
        return;
      }

      console.log('Requesting nonce...');
      const nonceResponse = await fetch(`/api/nonce`);
      if (!nonceResponse.ok) {
        console.error('Nonce fetch failed:', await nonceResponse.text());
        throw new Error('Failed to fetch nonce');
      }
      
      const { nonce } = await nonceResponse.json();
      console.log('Nonce received:', nonce);

      if (!nonce) {
        throw new Error('Invalid nonce received');
      }

      console.log('Initiating wallet auth...');
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        notBefore: new Date(),
        statement: 'Sign in with your Ethereum wallet'
      });

      console.log('Wallet auth response:', finalPayload);

      if (!finalPayload || finalPayload.status !== 'success') {
        console.error('Wallet auth failed:', finalPayload);
        throw new Error('Authentication failed');
      }

      console.log('Completing SIWE verification...');
      const response = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      const data = await response.json();
      console.log('SIWE completion response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete authentication');
      }

      if (data.isRegistered) {
        router.push(callbackUrl);
      } else {
        router.push(`/register?userId=${data.address}`);
      }

    } catch (error) {
      if (error instanceof DOMException) {
        console.error('WorldID auth cancelled by user');
        return;
      }
      
      console.error('WorldID auth failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: error?.constructor?.name
      });
      
      let errorMessage = 'Authentication failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-screen h-[510px] -mt-4">
        <div className="w-screen absolute top-0 bg-white rounded-b-[65px] shadow-[inset_-5px_-5px_25px_0px_rgba(134,152,183,1.00),inset_5px_5px_25px_0px_rgba(248,248,246,1.00)]" />
        <div className="w-screen h-full px-[34px] pt-[125px] pb-[70px] absolute top-0 bg-[#2c5154] rounded-b-[65px] shadow-[21px_38px_64.69999694824219px_3px_rgba(0,0,0,0.25)] overflow-hidden">
          <div className="max-w-md mx-auto">
            <h1 className="text-white text-[50px] font-medium leading-[50px] mb-6">
              Discover Your <span className="font-bold">True Self</span>
            </h1>
            <h2 className="text-white text-[50px] font-medium leading-[50px]">
              Transform Your <span className="font-bold">Perspective</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 text-center mt-auto p-4">
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <FilledButton
          variant="default"
          size="sm"
          icon={Wallet}
          className="w-full max-w-[200px] h-10 text-base transform transition-all duration-300 hover:scale-105 mx-auto"
          onClick={handleWorldIDClick}
        >
          World ID
        </FilledButton>

        <OutlinedButton
          variant="default"
          size="sm"
          icon={Chrome}
          className="w-full max-w-[200px] h-10 text-base transform transition-all duration-300 hover:scale-105 mx-auto"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Google sign in
        </OutlinedButton>

        <p className="text-sm text-muted-foreground pb-6 mt-4">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
} 