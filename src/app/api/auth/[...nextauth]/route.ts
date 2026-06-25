import { handlers } from "@/lib/auth";
import { authDebugLog, getAuthEnvSnapshot } from "@/lib/auth-debug";
import type { NextRequest } from "next/server";

authDebugLog(
  "route.ts:init",
  "auth route module loaded",
  getAuthEnvSnapshot(),
  "H1",
);

async function wrapHandler(
  handler: (req: NextRequest) => Promise<Response> | Response,
  method: "GET" | "POST",
  req: NextRequest,
) {
  authDebugLog(
    "route.ts:handler:entry",
    "auth handler invoked",
    {
      method,
      path: req.nextUrl.pathname,
      search: req.nextUrl.search,
      host: req.headers.get("host"),
      ...getAuthEnvSnapshot(),
    },
    "H2",
  );

  try {
    const response = await handler(req);
    authDebugLog(
      "route.ts:handler:success",
      "auth handler completed",
      {
        method,
        status: response.status,
        location: response.headers.get("location"),
      },
      "H5",
    );
    return response;
  } catch (error) {
    authDebugLog(
      "route.ts:handler:error",
      "auth handler threw",
      {
        method,
        errorName: error instanceof Error ? error.name : "unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
      "H3",
    );
    throw error;
  }
}

export async function GET(req: NextRequest) {
  return wrapHandler(handlers.GET, "GET", req);
}

export async function POST(req: NextRequest) {
  return wrapHandler(handlers.POST, "POST", req);
}
