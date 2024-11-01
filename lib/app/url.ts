import { AppUrlPath } from "../../utils/enums";
import { app } from "../github/client"

export async function getAppInstallationUrl() {
  const url = await app().getInstallationUrl()
  return url;
}

export function getAppURL(path?: AppUrlPath) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path ? path : ''}`!
}
