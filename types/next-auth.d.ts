import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    customToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    customToken?: string
    userId?: string
  }
} 