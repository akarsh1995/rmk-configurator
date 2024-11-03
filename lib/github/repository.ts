import { Octokit } from 'octokit';
import { RmkFilePaths } from '../../utils/enums';

async function getFileContent({
  owner,
  repo,
  path,
  ref = 'main',
  authToken,
}: {
  owner: string;
  repo: string;
  path: string;
  ref: string;
  authToken: string;
}) {
  const octokit = new Octokit({ auth: authToken });

  try {
    // Get file content from GitHub
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref, // branch, tag, or commit SHA
    });

    if ('content' in data) {
      // Decode base64 content
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return content;
    } else {
      throw new Error('File content is not available');
    }
  } catch (error) {
    console.error('Error fetching file content:', error);
    return null;
  }
}

export async function getAccessibleRepositories(authToken: string) {
  try {
    const octo = new Octokit({ auth: authToken });
    const { data } = await octo.request('GET /installation/repositories', {
      per_page: 100, // max per page
    });

    return data.repositories.map((repo) => ({
      name: repo.name,
      owner: repo.owner.login,
    }));
  } catch (error) {
    console.error('Error fetching accessible repositories:', error);
    return [];
  }
}

export async function getKeyboardToml({
  owner,
  repo,
  ref = 'main',
  authToken,
}: {
  owner: string;
  repo: string;
  ref: string;
  authToken: string;
}) {
  return getFileContent({
    owner,
    repo,
    path: 'keyboard.toml',
    ref,
    authToken,
  });
}

export async function getVialJson({
  owner,
  repo,
  ref = 'main',
  authToken,
}: {
  owner: string;
  repo: string;
  ref: string;
  authToken: string;
}) {
  return getFileContent({
    owner,
    repo,
    path: 'vial.json',
    ref,
    authToken,
  });
}

export async function commitMultipleFilesToRepo({
  owner,
  repo,
  branch = 'main',
  files, // Array of file objects with { path, content }
  message,
  authToken,
}: {
  owner: string;
  repo: string;
  branch?: string;
  files: { path: RmkFilePaths; content: string }[];
  message: string;
  authToken: string;
}) {
  try {
    const octokit = new Octokit({ auth: authToken });

    // Step 1: Get the latest commit on the branch
    const { data: refData } = await octokit.request(
      'GET /repos/{owner}/{repo}/git/ref/heads/{branch}',
      { owner, repo, branch }
    );
    const latestCommitSha = refData.object.sha;

    // Step 2: Get the commit data to retrieve the tree SHA
    const { data: commitData } = await octokit.request(
      'GET /repos/{owner}/{repo}/git/commits/{commit_sha}',
      { owner, repo, commit_sha: latestCommitSha }
    );
    const baseTreeSha = commitData.tree.sha;

    // Step 3: Create blobs for each file
    const blobs = await Promise.all(
      files.map(
        async (
          file
        ): Promise<{
          path: string;
          mode: '100644' | '100755' | '040000' | '160000' | '120000';
          type: 'blob' | 'tree' | 'commit';
          sha: string;
        }> => {
          const { data: blobData } = await octokit.request(
            'POST /repos/{owner}/{repo}/git/blobs',
            {
              owner,
              repo,
              content: Buffer.from(file.content).toString('base64'),
              encoding: 'base64',
            }
          );
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
          };
        }
      )
    );

    // Step 4: Create a new tree with all blobs
    const { data: newTree } = await octokit.request(
      'POST /repos/{owner}/{repo}/git/trees',
      {
        owner,
        repo,
        tree: blobs,
        base_tree: baseTreeSha,
      }
    );

    // Step 5: Create a new commit with the new tree
    const { data: newCommit } = await octokit.request(
      'POST /repos/{owner}/{repo}/git/commits',
      { owner, repo, message, tree: newTree.sha, parents: [latestCommitSha] }
    );

    // Step 6: Update the branch reference to point to the new commit
    await octokit.request(
      'PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}',
      {
        owner,
        repo,
        branch,
        sha: newCommit.sha,
      }
    );

    console.log('Commit created successfully:', newCommit.sha);
  } catch (error) {
    console.error('Error committing files:', error);
  }
}
