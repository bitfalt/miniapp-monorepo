'use client';
import { useEffect, useState } from 'react';

export default function SessionCheck() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check existing session
    fetch('/api/me')
      .then(res => res.json())
      .then(data => data.address && setAddress(data.address));
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setAddress(null);
    window.location.reload();
  };

  return (
    <div className="p-4 border rounded">
      {address ? (
        <div>
          <p>Connected: {address}</p>
          <button 
            onClick={handleSignOut}
            className="mt-2 text-red-500"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
}