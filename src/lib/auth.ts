import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { authDebugLog, getAuthEnvSnapshot } from "./auth-debug"
import prisma from "./prisma"

authDebugLog(
  "auth.ts:init:before-nextauth",
  "initializing NextAuth config",
  getAuthEnvSnapshot(),
  "H3",
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "production",
  providers: [GitHub, Google],
})

authDebugLog(
  "auth.ts:init:after-nextauth",
  "NextAuth config initialized",
  { providerCount: 2 },
  "H3",
)