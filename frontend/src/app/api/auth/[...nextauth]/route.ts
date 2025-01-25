import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set');
}
if (!process.env.WLD_CLIENT_ID) {
  throw new Error('WLD_CLIENT_ID must be set');
}
if (!process.env.WLD_CLIENT_SECRET) {
  throw new Error('WLD_CLIENT_SECRET must be set');
}
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID must be set');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET must be set');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set');
}

const JWT_SECRET = process.env.JWT_SECRET;

const WorldcoinProvider = {
  id: "worldcoin",
  name: "Worldcoin",
  type: "oauth" as const,
  wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
  authorization: { params: { scope: "openid" } },
  clientId: process.env.WLD_CLIENT_ID,
  clientSecret: process.env.WLD_CLIENT_SECRET,
  idToken: true,
  profile(profile) {
    return {
      id: profile.sub,
      name: profile.sub,
      email: profile.email
    };
  },
};

const authOptions: NextAuthOptions = {
  providers: [
    WorldcoinProvider,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        // Sign a custom JWT token
        const customToken = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        token.customToken = customToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.customToken) {
        session.customToken = token.customToken as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
