import type { DefaultSession } from 'next-auth';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    customToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      walletAddress?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    walletAddress?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    customToken?: string;
    userId?: string;
  }
}
