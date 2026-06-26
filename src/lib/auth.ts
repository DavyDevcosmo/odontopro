import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { authConfig } from "./auth.config"
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

// Prisma Adapter persiste contas OAuth; JWT strategy mantém sessões stateless.
// Callback session com Prisma resolve o user.id real no servidor (não no middleware/edge).
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      const email =
        (typeof token.email === "string" ? token.email : session.user.email) ??
        undefined

      if (email) {
        session.user.email = email
      }

      const candidateId = typeof token.sub === "string" ? token.sub : undefined

      if (candidateId) {
        const userById = await prisma.user.findUnique({
          where: { id: candidateId },
          select: { id: true },
        })
        if (userById) {
          session.user.id = userById.id
          return session
        }
      }

      if (email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email },
          select: { id: true },
        })
        if (userByEmail) {
          session.user.id = userByEmail.id
        }
      }

      return session
    },
  },
})
