import { Octokit } from "octokit";

export async function getAccessibleRepositories(authToken: string) {
  try {
    const octo = new Octokit({ auth: authToken });
    const { data } = await octo.request('GET /installation/repositories', {
      per_page: 100, // max per page
    });

    return data.repositories.map(repo => ({ name: repo.full_name, repoId: repo.id }));
  } catch (error) {
    console.error('Error fetching accessible repositories:', error);
    return [];
  }
}

