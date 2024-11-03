import { IGithubRepository } from '@/interfaces/IGithubRepository';
import { create } from 'zustand';

interface IGitHubStore {
  allRepositories: IGithubRepository[];
  name?: string;
  owner?: string;
  selectRepository: (idx: number) => void;
  setRepositories: (allRepositories: IGithubRepository[]) => void;
}

export const useGithubStore = create<IGitHubStore>()((set) => ({
  allRepositories: [],
  name: undefined,
  owner: undefined,
  selectRepository: (idx: number) =>
    set((state) => ({
      name: state.allRepositories[idx].name,
      owner: state.allRepositories[idx].owner,
    })),
  setRepositories: (allRepositories: IGithubRepository[]) =>
    set(() => ({
      allRepositories,
      name: allRepositories[0].name,
      owner: allRepositories[0].owner,
    })),
}));
