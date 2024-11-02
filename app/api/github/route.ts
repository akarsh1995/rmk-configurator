import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CookieKey } from "../../../utils/enums";
import { getAccessibleRepositories } from "../../../lib/github/repository";
import { getTheInstallationAccessToken, getUserAuthUrl } from "../../../lib/github/auth";
import { getAppInstallationUrl, getAppURL } from "../../../lib/app/url";

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

  if (!installationToken && (userAccessToken || userRefreshToken || installationId || oAuthCode)) {

    const installationAuthResult = await getTheInstallationAccessToken({
      userAccessToken: userAccessToken ? userAccessToken.value : undefined,
      refreshToken: userRefreshToken ? userRefreshToken.value : undefined,
      installationId: installationId ? installationId : undefined,
      code: oAuthCode && oAuthState && {
        oAuthCode,
        oAuthState
      } || undefined,
    });


    if (installationAuthResult?.data.repositories?.length === 0) {
      return NextResponse.redirect(await getAppInstallationUrl());
    }
    return NextResponse.redirect(getAppURL());
  } else if (installationToken) {

    const respositories = await getAccessibleRepositories(installationToken.value);

    if (respositories.length === 0) {
      return NextResponse.redirect(await getAppInstallationUrl());
    }
  } else {
    return NextResponse.redirect(getUserAuthUrl());
  }
}


