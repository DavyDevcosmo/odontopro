import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [GitHub, Google],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname.startsWith("/dashboard")) {
        return !!auth?.user
      }
      return true
    },
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
    session({ session, token }) {
      if (!session.user) {
        return session
      }

      if (typeof token.sub === "string") {
        session.user.id = token.sub
      }

      if (typeof token.email === "string") {
        session.user.email = token.email
      }

      return session
    },
  },
} satisfies NextAuthConfig
