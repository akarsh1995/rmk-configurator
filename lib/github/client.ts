import { App } from "@octokit/app";

const app = () => {
  const APP_ID = process.env.GH_APP_ID;
  const CLIENT_ID = process.env.GH_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.GH_APP_CLIENT_SECRET;
  const PRIVATE_KEY = process.env.GH_APP_PRIVATE_KEY;

  if (
    !APP_ID ||
    !CLIENT_ID ||
    !CLIENT_SECRET ||
    !PRIVATE_KEY
  )
    throw new Error('Environment variables missing!')

  const app = new App({
    appId: APP_ID, // Use environment variables for sensitive info
    privateKey: PRIVATE_KEY,
    oauth: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
  });
  return app;

}

export { app };
