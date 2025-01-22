'use client';
import { MiniKit } from '@worldcoin/minikit-js';

export default function SignInButton() {
  const handleSignIn = async () => {
    if (!MiniKit.isInstalled()) {
      alert('Please install World App');
      return;
    }

    try {
      // Get nonce
      const nonceRes = await fetch('/api/nonce');
      const { nonce } = await nonceRes.json();

      // Trigger wallet auth
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: 'Sign in to My App',
      });

      // Verify signature
      const res = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      if (res.ok) {
        window.location.reload(); // Refresh to update session state
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  return (
    <button 
      onClick={handleSignIn}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Sign In with Wallet
    </button>
  );
}