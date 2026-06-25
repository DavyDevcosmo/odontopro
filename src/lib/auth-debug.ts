const DEBUG_ENDPOINT =
  "http://127.0.0.1:7726/ingest/00e72d34-9e04-4030-9bf1-9ee3e632dbb1";

export function authDebugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
  runId = "pre-fix",
) {
  const payload = {
    sessionId: "111b0b",
    runId,
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };

  // #region agent log
  console.error("[DEBUG-AUTH]", JSON.stringify(payload));
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "111b0b",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
}

export function getAuthEnvSnapshot() {
  return {
    nodeEnv: process.env.NODE_ENV ?? "undefined",
    vercel: Boolean(process.env.VERCEL),
    hasAuthSecret: Boolean(
      process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    ),
    hasAuthGoogleId: Boolean(process.env.AUTH_GOOGLE_ID),
    hasAuthGoogleSecret: Boolean(process.env.AUTH_GOOGLE_SECRET),
    hasAuthGithubId: Boolean(process.env.AUTH_GITHUB_ID),
    hasAuthGithubSecret: Boolean(process.env.AUTH_GITHUB_SECRET),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasAuthUrl: Boolean(process.env.AUTH_URL ?? process.env.NEXTAUTH_URL),
    authUrlHost: (() => {
      try {
        return new URL(
          process.env.AUTH_URL ??
            process.env.NEXTAUTH_URL ??
            "http://invalid",
        ).host;
      } catch {
        return "invalid";
      }
    })(),
  };
}

export function getMissingAuthEnvVars() {
  const required = [
    ["AUTH_SECRET", Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET)],
    ["AUTH_GOOGLE_ID", Boolean(process.env.AUTH_GOOGLE_ID)],
    ["AUTH_GOOGLE_SECRET", Boolean(process.env.AUTH_GOOGLE_SECRET)],
    ["DATABASE_URL", Boolean(process.env.DATABASE_URL)],
    ["AUTH_URL", Boolean(process.env.AUTH_URL ?? process.env.NEXTAUTH_URL)],
  ] as const;

  return required.filter(([, present]) => !present).map(([name]) => name);
}
