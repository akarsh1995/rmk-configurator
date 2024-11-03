import { NextRequest, NextResponse } from 'next/server';
import {
  EmptyData,
  IApiResponse,
} from '../../../../../interfaces/IApiResponse';
import {
  commitMultipleFilesToRepo,
  getKeyboardToml,
  getTemplateConfig,
  getVialJson,
} from '../../../../../lib/github/repository';
import { getAccessTokenFromCookie } from '../../../../../utils/functions';
import RmkFwEditorError from '../../../../../lib/error';
import { RmkEditorErrorCode, RmkFilePaths } from '../../../../../utils/enums';
import { parse, stringify } from 'smol-toml';
import { IRmkConfig } from '@/interfaces/IRmkConfig';

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
        ref: 'main',
      });

      const vialJson = await getVialJson({
        owner,
        repo,
        authToken: accessToken,
        ref: 'main',
      });

      const templateConfig = await getTemplateConfig({
        owner,
        repo,
        authToken: accessToken,
        ref: 'main',
      });

      if (keyboardToml && vialJson && templateConfig) {
        const parsedKeyboardToml = parse(keyboardToml);
        const parsedVialJson = JSON.parse(vialJson);
        const parsedTemplate: {
          values: Pick<
            IRmkConfig,
            | 'keyboard_type'
            | 'microcontroller_family'
            | 'split_microcontroller'
            | 'connection'
            | 'target'
          >;
        } = parse(templateConfig) as {
          values: Pick<
            IRmkConfig,
            | 'keyboard_type'
            | 'microcontroller_family'
            | 'split_microcontroller'
            | 'connection'
            | 'target'
          >;
        };
        return NextResponse.json(
          {
            data: {
              keyboardToml: parsedKeyboardToml,
              vialJson: parsedVialJson,
              keyboard_type: parsedTemplate.values.keyboard_type,
              microcontroller_family:
                parsedTemplate.values.microcontroller_family,
              split_microcontroller:
                parsedTemplate.values.split_microcontroller,
              connection: parsedTemplate.values.connection,
              target: parsedTemplate.values.target,
            },
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            error: new RmkFwEditorError(
              RmkEditorErrorCode.MISSING_CONFIG_FILES
            ),
          } as IApiResponse<{ keyboardToml: string; vialJson: string }>,
          { status: 422 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: new RmkFwEditorError(RmkEditorErrorCode.MISSING_QUERY_PARAMS),
        } as IApiResponse<{ keyboardToml: string; vialJson: string }>,
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error in repositories route:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: IRmkConfig = await request.json();

    const keyaboardToml = body.keyboardToml;
    const vialJson = body.vialJson;

    const accessToken = await getAccessTokenFromCookie();
    const owner = request.nextUrl.searchParams.get('owner');
    const repo = request.nextUrl.searchParams.get('repo');

    const values = {
      keyboard_type: body.keyboard_type,
      microcontroller_family: body.microcontroller_family,
      split_microcontroller: body.split_microcontroller,
      connection: body.connection,
      target: body.target,
    };

    if (owner && repo && keyaboardToml && vialJson) {
      await commitMultipleFilesToRepo({
        owner,
        repo,
        branch: 'main',
        files: [
          {
            path: RmkFilePaths.KEYBOARD_TOML,
            content: stringify(keyaboardToml),
          },
          {
            path: RmkFilePaths.TEMPLATE_CONFIG,
            content: stringify({ values }),
          },
          { path: RmkFilePaths.VIAL_JSON, content: JSON.stringify(vialJson) },
        ],
        message: 'updates',
        authToken: accessToken,
      });
      return NextResponse.json({} as IApiResponse<EmptyData>, { status: 200 });
    } else {
      return NextResponse.json(
        {
          error: new RmkFwEditorError(RmkEditorErrorCode.MISSING_QUERY_PARAMS),
        } as IApiResponse<{ keyboardToml: string; vialJson: string }>,
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error in repositories route:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch repositories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
