import SignInButton from '@/components/SignInButton';
import SessionCheck from '@/components/SessionCheck';

export default function TestAuthPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl mb-4">Wallet Auth Test</h1>
      <SignInButton />
      <div className="mt-4">
        <SessionCheck />
      </div>
    </div>
  );
}