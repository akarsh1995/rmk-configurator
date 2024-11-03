import { cookies } from 'next/headers';
import { CookieKey } from './enums';

export async function getAccessTokenFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CookieKey.GITHUB_INSTALLATION_TOKEN)?.value;
  if (!token) throw new Error('token not found');
  return token;
}

export async function setTokensCookies(data: {
  accessToken?: { token: string; expires: string };
  refreshToken?: { token: string; expires: string };
  installationToken?: { token: string; expires: string };
}) {
  const cookieStore = await cookies();
  data.accessToken &&
    cookieStore.set(
      CookieKey.GITHUB_USER_ACCESS_TOKEN,
      data.accessToken.token,
      { expires: new Date(data.accessToken.expires) }
    );
  data.refreshToken &&
    cookieStore.set(
      CookieKey.GITHUB_USER_REFRESH_TOKEN,
      data.refreshToken.token,
      { expires: new Date(data.refreshToken.expires) }
    );
  data.installationToken &&
    cookieStore.set(
      CookieKey.GITHUB_INSTALLATION_TOKEN,
      data.installationToken.token,
      { expires: new Date(data.installationToken.expires) }
    );
}
