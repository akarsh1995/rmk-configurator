'use client'
import { useEffect, useState } from "react";
import {  getCookie } from 'cookies-next';
import { AppUrlPath, CookieKey, RmkEditorErrorCode } from "../utils/enums";
import { getAppURL } from "../lib/app/url";

export default function Home() {
  const [authUrl, setAuthUrl] = useState<string>()
  const [repos, setRepos] = useState({ repos: [] })

  const setUserAccessToken = async () => {
    const url = getAppURL(AppUrlPath.GH_REPO);
    const results = await fetch(url);
    const jsonObj = await results.json();

    if (jsonObj.error?.code === RmkEditorErrorCode.MISSING_INSTALLATION_CODE) {
      setAuthUrl(getAppURL(AppUrlPath.GH_AUTH));
    }

    setRepos(jsonObj);
  }

  useEffect(() => {
    setUserAccessToken()
  }, [])


  return (
    <>
      {repos.repos && repos.repos.map((repo, i) => <div key={i}>{(repo as any).name}</div>)}
      <div>{authUrl && <a href={authUrl}>github connect</a>}</div>
    </>
  );
}
