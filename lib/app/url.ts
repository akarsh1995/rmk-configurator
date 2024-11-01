import { AppUrlPath } from "../../utils/enums";
import { app } from "../github/client"

export async function getAppInstallationUrl() {
  const url = await app().getInstallationUrl()
  return url;
  // return `https://github.com/apps/rmk-firmware-configurator/installations/select_target`
}

export function getAppURL(path?: AppUrlPath) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path ? path : ''}`!
}
