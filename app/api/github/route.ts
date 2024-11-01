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

// await commitFileToRepo({ owner: 'akarsh1995', repo: 'rmk-editor', branch: 'main', path: 'keyboard.toml', content: 'this is toml content', message: 'initial commit', appInstallationId: 123456 });
//     return NextResponse.json(
//       { data: 'success' },
//       { status: 200 },
//     );




// async function commitFileToRepo(
// { owner, repo, branch, path, content, message, appInstallationId }: { owner: string; repo: string; branch: string; path: string; content: string; message: string; appInstallationId: number;}) {
//   try {
//     // Step 1: Get the latest commit on the branch

//     const octokit = await app.getInstallationOctokit(appInstallationId);

//     const { data: refData } = await octokit.request(
//       'GET /repos/{owner}/{repo}/git/ref/heads/{branch}',
//       { owner, repo, branch }
//     );

//     const latestCommitSha = refData.object.sha;

//     // Step 2: Get the commit data to retrieve the tree SHA
//     const { data: commitData } = await octokit.request(
//       'GET /repos/{owner}/{repo}/git/commits/{commit_sha}',
//       { owner, repo, commit_sha: latestCommitSha }
//     );

//     const baseTreeSha = commitData.tree.sha;

//     // Step 3: Create a new blob with the file content
//     const { data: blobData } = await octokit.request(
//       'POST /repos/{owner}/{repo}/git/blobs',
//       { owner, repo, content: Buffer.from(content).toString('base64'), encoding: 'base64' }
//     );

//     // Step 4: Create a new tree with the blob based on the base tree
//     const { data: newTree } = await octokit.request(
//       'POST /repos/{owner}/{repo}/git/trees',
//       {
//         owner,
//         repo,
//         tree: [{ path, mode: '100644', type: 'blob', sha: blobData.sha }],
//         base_tree: baseTreeSha,
//       }
//     );

//     // Step 5: Create a new commit with the new tree
//     const { data: newCommit } = await octokit.request(
//       'POST /repos/{owner}/{repo}/git/commits',
//       { owner, repo, message, tree: newTree.sha, parents: [latestCommitSha] }
//     );

//     // Step 6: Update the branch reference to point to the new commit
//     await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}', {
//       owner,
//       repo,
//       branch,
//       sha: newCommit.sha,
//     });

//     console.log('Commit created successfully:', newCommit.sha);
//   } catch (error) {
//     console.error('Error committing file:', error);
//   }
// }
