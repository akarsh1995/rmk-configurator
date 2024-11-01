// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AppUrlPath, CookieKey, RmkEditorErrorCode } from "./utils/enums";
import { setTokensCookies } from "./utils/functions";
import { getAppURL } from "./lib/app/url";
import RmkFwEditorError from "./lib/error";
import { EmptyData, IApiResponse } from "./interfaces/IApiResponse";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  const installationToken = cookieStore.get(CookieKey.GITHUB_INSTALLATION_TOKEN);

  if (!installationToken) {
    return NextResponse.json({ error: new RmkFwEditorError(RmkEditorErrorCode.MISSING_INSTALLATION_CODE) } as IApiResponse<EmptyData>, { status: 422 });
  }

  // Continue to the requested page if authenticated
  return NextResponse.next();
}

// Optional: Apply middleware only to protected paths
export const config = {
  matcher: ['/api/github/repository'], // Only runs on dashboard and profile routes
};
