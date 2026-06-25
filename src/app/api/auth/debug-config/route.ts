import { getAuthEnvSnapshot } from "@/lib/auth-debug";

export async function GET() {
  const snapshot = getAuthEnvSnapshot();

  // #region agent log
  console.error("[DEBUG-AUTH]", JSON.stringify({
    sessionId: "111b0b",
    runId: "vercel-diagnostic",
    hypothesisId: "H1",
    location: "debug-config/route.ts",
    message: "production auth env snapshot",
    data: snapshot,
    timestamp: Date.now(),
  }));
  // #endregion

  return Response.json(snapshot);
}
