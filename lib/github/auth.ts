import { setTokensCookies } from "../../utils/functions";
import { Octokit } from "@octokit/core";
import { app } from "./client";
import { getAppURL } from "../app/url";
import { AppUrlPath } from "../../utils/enums";

export function getTheInstallationAccessToken(data: { userAccessToken?: string; refreshToken?: string; installationId?: string; code?: { oAuthCode: string; oAuthState: string; } }) {
  if (data.userAccessToken) {
    return getInstallationTokenByUserAccessToken({ userAccessToken: data.userAccessToken });
  } else if (data.refreshToken) {
    return getInstallationTokenByRefreshToken({ refreshToken: data.refreshToken });
  } else if (data.code) {
    return getInstallationTokenByCodeAndState({ code: data.code.oAuthCode, state: data.code.oAuthState });
  } else if (data.installationId) {
    return getInstallationTokenByInstallationId({ installationId: parseInt(data.installationId) });
  }

  return;
}

export async function getInstallationTokenByUserAccessToken(data: { userAccessToken: string; }) {
  const kit = await app().oauth.getUserOctokit({ 'token': data.userAccessToken });
  return getInstallationTokenByKit(kit);
}

export async function getInstallationTokenByKit(kit: Octokit) {
  const user = await kit.request('GET /user');
  const username = user.data.login;
  const appId = process.env.GH_APP_ID; if (!appId) throw new Error(`process.env.GH_APP_ID=${process.env.GH_APP_ID}`);
  const installationKit = await app().getInstallationOctokit(parseInt(appId));
  const installation = await installationKit.request('GET /users/{username}/installation', { username: username });
  const installationAccessToken = await installationKit.request('POST /app/installations/{installation_id}/access_tokens', { installation_id: installation.data.id });
  await setTokensCookies({ installationToken: { token: installationAccessToken.data.token, expires: installationAccessToken.data.expires_at } });
  return installationAccessToken;
}

export async function getInstallationTokenByRefreshToken(data: { refreshToken: string }) {
  const refreshTokenResponse = await app().oauth.refreshToken({ refreshToken: data.refreshToken });
  // update access token
  const accessToken = refreshTokenResponse.data.access_token;
  const expires = new Date(Date.now() + (refreshTokenResponse.data.expires_in) * 1000).toISOString();
  await setTokensCookies({ accessToken: { token: accessToken, expires: expires } });
  return getInstallationTokenByUserAccessToken({ userAccessToken: accessToken });
}


export async function getInstallationTokenByInstallationId(data: { installationId: number }) {
  const appId = process.env.GH_APP_ID; if (!appId) throw new Error(`process.env.GH_APP_ID=${process.env.GH_APP_ID}`);
  const installationKit = await app().getInstallationOctokit(parseInt(appId))
  const installation = await installationKit.request('POST /app/installations/{installation_id}/access_tokens', { installation_id: data.installationId });
  const token = installation.data.token;
  const expires = installation.data.expires_at;
  await setTokensCookies({ installationToken: { token, expires } });
  return installation
}


export async function getInstallationTokenByCodeAndState(
  data: { code: string; state: string; }
) {
  const token = await app().oauth.createToken(data);
  if (token.authentication.refreshToken && token.authentication.expiresAt && token.authentication.refreshTokenExpiresAt) {
    await setTokensCookies(
      {
        accessToken: { token: token.authentication.token, expires: token.authentication.expiresAt },
        refreshToken: { token: token.authentication.refreshToken, expires: token.authentication.refreshTokenExpiresAt },
      }
    );
  }
  const kit = await app().oauth.getUserOctokit({ token: token.authentication.token });
  return getInstallationTokenByKit(kit);
}


export async function createUserAccessToken(data: { code: string; state: string; }) {
  const token = await app().oauth.createToken(data);
  if (token.authentication.refreshToken && token.authentication.expiresAt && token.authentication.refreshTokenExpiresAt) {
    await setTokensCookies(
      {
        accessToken: { token: token.authentication.token, expires: token.authentication.expiresAt },
        refreshToken: { token: token.authentication.refreshToken, expires: token.authentication.refreshTokenExpiresAt },
      }
    );
  }
  return token;
}


export function getUserAuthUrl() {
  return app().oauth.getWebFlowAuthorizationUrl({ redirectUrl: getAppURL(AppUrlPath.GH_AUTH) }).url
}
