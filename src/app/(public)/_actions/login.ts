"use server"

import { signIn } from '@/lib/auth'
import { authDebugLog, getAuthEnvSnapshot } from '@/lib/auth-debug'

type LoginType = "google" | "github"

export async function handleRegister(provider: LoginType) {
  authDebugLog(
    "login.ts:handleRegister",
    "server action signIn called",
    { provider, ...getAuthEnvSnapshot() },
    "H4",
  )

  try {
    await signIn(provider, { redirectTo: "/dashboard" })
    authDebugLog(
      "login.ts:handleRegister:success",
      "signIn completed without throw",
      { provider },
      "H4",
    )
  } catch (error) {
    authDebugLog(
      "login.ts:handleRegister:error",
      "signIn threw in server action",
      {
        provider,
        errorName: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      "H4",
    )
    throw error
  }
}