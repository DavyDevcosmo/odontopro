import { getAuthEnvSnapshot, getMissingAuthEnvVars } from "@/lib/auth-debug";

export async function GET() {
  const snapshot = getAuthEnvSnapshot();
  const missing = getMissingAuthEnvVars();

  // #region agent log
  console.error("[DEBUG-AUTH]", JSON.stringify({
    sessionId: "111b0b",
    runId: "vercel-diagnostic",
    hypothesisId: "H1",
    location: "health/auth-env/route.ts",
    message: "vercel auth env snapshot",
    data: { snapshot, missing },
    timestamp: Date.now(),
  }));
  // #endregion

  return Response.json({ ok: missing.length === 0, missing, snapshot });
}
