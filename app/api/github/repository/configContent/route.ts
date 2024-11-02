import { NextRequest, NextResponse } from "next/server";
import { IApiResponse } from "../../../../../interfaces/IApiResponse";
import { getKeyboardToml, getVialJson } from "../../../../../lib/github/repository";
import { getAccessTokenFromCookie } from "../../../../../utils/functions";
import RmkFwEditorError from "../../../../../lib/error";
import { RmkEditorErrorCode } from "../../../../../utils/enums";
import { parse } from "smol-toml";

// GET handler with pagination support
export async function GET(request: NextRequest) {
  try {

    const accessToken = await getAccessTokenFromCookie();
    const owner = request.nextUrl.searchParams.get('owner');
    const repo = request.nextUrl.searchParams.get('repo');

    if (owner && repo) {

      const keyboardToml = await getKeyboardToml({
        owner,
        repo,
        authToken: accessToken,
        ref: 'main'
      });

      const vialJson = await getVialJson(
        {
          owner,
          repo,
          authToken: accessToken,
          ref: 'main'
        }
      );
      if (keyboardToml && vialJson) {

        const parsedKeyboardToml = ((parse(keyboardToml)));
        const parsedVialJson = JSON.parse(((vialJson)));
        return NextResponse.json({ data: { keyboardToml: parsedKeyboardToml, vialJson: parsedVialJson } }, { status: 200 });
      } else {
        return NextResponse.json({ error: new RmkFwEditorError(RmkEditorErrorCode.MISSING_CONFIG_FILES) } as IApiResponse<{ keyboardToml: string; vialJson: string; }>, { status: 422 });
      }
    } else {
      return NextResponse.json({ error: new RmkFwEditorError(RmkEditorErrorCode.MISSING_QUERY_PARAMS) } as IApiResponse<{ keyboardToml: string; vialJson: string; }>, { status: 422 });
    };

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
