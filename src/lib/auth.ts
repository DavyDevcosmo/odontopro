import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { authDebugLog, getAuthEnvSnapshot } from "./auth-debug"
import prisma from "./prisma"

function resolveAuthUrl(): string | undefined {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined)
  )
}

const resolvedAuthUrl = resolveAuthUrl()
if (resolvedAuthUrl && !process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
  process.env.AUTH_URL = resolvedAuthUrl
}

authDebugLog(
  "auth.ts:init:before-nextauth",
  "initializing NextAuth config",
  { ...getAuthEnvSnapshot(), resolvedAuthUrl: resolvedAuthUrl ?? null },
  "H3",
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  providers: [GitHub, Google],
  callbacks: {
    jwt({ token, user, profile }) {
      if (user?.id) {
        token.sub = user.id
      }
      if (user?.email) {
        token.email = user.email
      } else if (profile && typeof profile === "object" && "email" in profile) {
        const profileEmail = profile.email
        if (typeof profileEmail === "string") {
          token.email = profileEmail
        }
      }
      return token
    },
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      if (typeof token.email === "string") {
        session.user.email = token.email
      }

      if (token.sub) {
        session.user.id = token.sub
      }

      if (!session.user.id && session.user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        })
        if (dbUser) {
          session.user.id = dbUser.id
        }
      }

      return session
    },
  },
})

authDebugLog(
  "auth.ts:init:after-nextauth",
  "NextAuth config initialized",
  { providerCount: 2 },
  "H3",
)