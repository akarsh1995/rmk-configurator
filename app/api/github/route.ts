import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CookieKey, RmkEditorErrorCode } from "../../../utils/enums";
import { getAccessibleRepositories } from "../../../lib/github/repository";
import { createUserAccessToken, getInstallationTokenByInstallationId, getInstallationTokenByKit, getTheInstallationAccessToken, getUserAuthUrl } from "../../../lib/github/auth";
import { getAppInstallationUrl, getAppURL } from "../../../lib/app/url";
import RmkFwEditorError from "../../../lib/error";
import { app } from "../../../lib/github/client";
import { setTokensCookies } from "../../../utils/functions";

export async function GET(request: NextRequest) {
  const oAuthCode = request.nextUrl.searchParams.get('code');
  const oAuthState = request.nextUrl.searchParams.get('state');
  const installationId = request.nextUrl.searchParams.get('installation_id');
  // can be used to take action when user installs/add repository to the app
  // const setupAction = request.nextUrl.searchParams.get('setup_action');

  const cookieStore = await cookies();
  const installationToken = cookieStore.get(CookieKey.GITHUB_INSTALLATION_TOKEN);
  const userAccessToken = cookieStore.get(CookieKey.GITHUB_USER_ACCESS_TOKEN);
  const userRefreshToken = cookieStore.get(CookieKey.GITHUB_USER_REFRESH_TOKEN);

  const isCallback = installationId || oAuthCode

  let installationKit;

  if (installationToken) {
    try {
      await app().oauth.checkToken({ token: installationToken.value });
      return NextResponse.redirect(getAppURL());
    } catch (e) {
      console.error(`Installation token invalid deleting stale token`);
      cookieStore.delete(CookieKey.GITHUB_INSTALLATION_TOKEN);
    }
  }

  if (installationId) {
    // app is installed successfully
    try {
      installationKit = await getInstallationTokenByInstallationId({ installationId: parseInt(installationId) })
    } catch (e) {
      return NextResponse.json({ error: new RmkFwEditorError(RmkEditorErrorCode.AUTH_ERROR) }, { status: 422 });
    }
  } else if (userRefreshToken || userAccessToken || oAuthCode) {
    let userAccessKit;
    // flow when user access tokens are present in the cookies
    if (userAccessToken) {
      try {
        userAccessKit = await app().oauth.getUserOctokit({ 'token': userAccessToken.value });
      } catch (e) {
        console.error(`Failed to get user access kit using user access token may retry with refresh token`, e);
        return NextResponse.redirect(getUserAuthUrl());
      }
    }

    if (userRefreshToken && !userAccessKit) {
      try {
        const refreshToken = await app().oauth.refreshToken({ 'refreshToken': userRefreshToken.value });
        await setTokensCookies({ accessToken: { token: refreshToken.authentication.token, expires: refreshToken.authentication.expiresAt } });
        userAccessKit = await app().oauth.getUserOctokit({ 'token': refreshToken.authentication.token });
      } catch (e) {
        console.error(`Failed to get user access kit using refresh token`);
        return NextResponse.redirect(getUserAuthUrl());
      }
    }

    if (oAuthCode && oAuthState) {
      // user is authenticated successfully
      try {
        const token = await createUserAccessToken({ code: oAuthCode, state: oAuthState })
        userAccessKit = await app().oauth.getUserOctokit({ token: token.authentication.token });
      } catch (e) {
        return NextResponse.json({ error: new RmkFwEditorError(RmkEditorErrorCode.AUTH_ERROR) }, { status: 422 });
      }
    }

    if (userAccessKit) {
      try {
        installationKit = await getInstallationTokenByKit(userAccessKit);
      } catch (e) {
        console.error(`Failed to fetch installation kit looks like the app is not installed redirecting to install the app`)
        return NextResponse.redirect(await getAppInstallationUrl());
      }
    }
  } else {
    return NextResponse.redirect(getUserAuthUrl());
  }

  if (installationKit?.data.repositories?.length === 0) {
    return NextResponse.redirect(await getAppInstallationUrl());
  } else {
    return NextResponse.redirect(getAppURL());
  }
}


