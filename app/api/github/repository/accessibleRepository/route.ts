import { NextResponse } from "next/server";
import { IApiResponse } from "../../../../../interfaces/IApiResponse";
import { getAccessibleRepositories } from "../../../../../lib/github/repository";
import { getAccessTokenFromCookie } from "../../../../../utils/functions";

// GET handler with pagination support
export async function GET(): Promise<
  | NextResponse<IApiResponse<{ name: string; owner: string }[]>>
  | NextResponse<{ error: string; message: string }>
> {
  try {
    const accessToken = await getAccessTokenFromCookie();
    const repos = await getAccessibleRepositories(accessToken);
    return NextResponse.json({ data: repos }, { status: 200 });
  } catch (error) {
    console.error("Error in repositories route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repositories",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
