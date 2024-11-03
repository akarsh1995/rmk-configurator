'use client';
import dynamic from 'next/dynamic';
import { AppUrlPath, RmkEditorErrorCode } from '../utils/enums';
import { getAppURL } from '../lib/app/url';
import { IApiResponse } from '../interfaces/IApiResponse';
import { allRmkKeyboardConfigs } from '@/lib/config/allKeyboards';
import { useKeyboardConfigStore } from '@/store/keyboardConfigStore';
import { Select } from '@/components/reactTags';
import { IKeyboardTomlConfig } from '@/interfaces/IKeyboardConfig';
import { IVialJSONConfig } from '@/interfaces/IVialConfig';
import { useRouter } from 'next/navigation';
import { useGithubStore } from '@/store/githubStore';
import { useEffect } from 'react';

// Dynamically import the component
const JsonEditor = dynamic(() => import('../components/editor'), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const keyboardConfigStore = useKeyboardConfigStore();
  const githubStore = useGithubStore();

  const fetchRepositories = async () => {
    const url = getAppURL(AppUrlPath.GH_REPO);
    const results = await fetch(url);
    const jsonObj: IApiResponse<{ name: string; owner: string }[]> =
      await results.json();

    if (
      'error' in jsonObj &&
      jsonObj.error.code === RmkEditorErrorCode.MISSING_INSTALLATION_CODE
    ) {
      router.push(AppUrlPath.GH_AUTH);
    } else if ('data' in jsonObj && jsonObj.data.length) {
      const r = jsonObj.data;
      githubStore.setRepositories(r);
    }
  };

  const getConfigContent = async () => {
    const configContentUrl = getAppURL(AppUrlPath.GH_CONFIG_CONTENT);
    if (githubStore.owner && githubStore.name) {
      const results = await fetch(
        `${configContentUrl}?owner=${githubStore.owner}&repo=${githubStore.name}`
      );
      const jsonObj: IApiResponse<{ keyboardToml: object; vialJson: object }> =
        await results.json();

      if ('error' in jsonObj) {
        console.log(jsonObj);
      } else if ('data' in jsonObj) {
        const parsedKeyboardToml = jsonObj.data
          .keyboardToml as IKeyboardTomlConfig;
        const parsedVialJson = jsonObj.data.vialJson as IVialJSONConfig;
        keyboardConfigStore.updateExistingConfig({
          toml: parsedKeyboardToml,
          vial: parsedVialJson,
          configKey: 'user',
        });
      }
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    getConfigContent();
  }, [githubStore.allRepositories, githubStore.name]);

  return (
    <div>
      {githubStore.allRepositories.length && (
        <Select
          options={githubStore.allRepositories.map((repo, i) => ({
            label: `${repo.owner}/${repo.name}`,
            value: i.toString(),
          }))}
          value={'0'}
          onChange={(i: string) => githubStore.selectRepository(parseInt(i))}
        />
      )}

      <div>
        {keyboardConfigStore.toml && keyboardConfigStore.vial && (
          <Select
            options={keyboardConfigStore.allConfigs.map((config) => ({
              label: config,
              value: config,
            }))}
            value={keyboardConfigStore.configKey}
            onChange={(configKey) => {
              if (configKey === 'user') {
                getConfigContent();
              } else {
                keyboardConfigStore.updateExistingConfig({
                  configKey,
                  vial: allRmkKeyboardConfigs[configKey].vialJson,
                  toml: allRmkKeyboardConfigs[configKey].keyboardToml,
                });
              }
            }}
          />
        )}
      </div>
      <br />
      {githubStore.allRepositories.length && (
        <button
          onClick={async () => {
            const configContentUrl = getAppURL(AppUrlPath.GH_CONFIG_CONTENT);
            const body = JSON.stringify({
              keyboardToml: keyboardConfigStore.toml,
              vialJson: keyboardConfigStore.toml,
            });

            const response = await fetch(
              `${configContentUrl}?owner=${githubStore.owner}&repo=${githubStore.name}`,
              {
                method: 'POST', // Specify the request method
                headers: {
                  'Content-Type': 'application/json', // Set the headers, especially if sending JSON
                },
                body, // Convert the data to a JSON string
              }
            );
            console.log(response);
          }}
        >
          Save Config
        </button>
      )}
      <h2>Edit your keyboard.toml</h2>
      {keyboardConfigStore.toml && (
        <JsonEditor
          data={keyboardConfigStore.toml}
          setData={(data) => {
            keyboardConfigStore.updateExistingConfig({
              toml: data as IKeyboardTomlConfig,
            });
          }}
        />
      )}

      <h2>Edit your vial.json</h2>
      {keyboardConfigStore.vial && (
        <JsonEditor
          data={keyboardConfigStore.vial}
          setData={(data) =>
            keyboardConfigStore.updateExistingConfig({
              vial: data as IVialJSONConfig,
            })
          }
        />
      )}
    </div>
  );
}
