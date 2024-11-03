'use client';
import dynamic from 'next/dynamic';
import {
  AppUrlPath,
  RmkConnectionTypes,
  RmkEditorErrorCode,
  RmkKeyboardTypes,
  RmkMcuFamily,
  RmkMcus,
  RmkRustCompilationTargets,
} from '../utils/enums';
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
import { getEnumKeysAndValues } from '@/utils/clientFunctions';
import { IRmkConfig } from '@/interfaces/IRmkConfig';

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
      const jsonObj: IApiResponse<IRmkConfig> = await results.json();

      if ('error' in jsonObj) {
        console.log(jsonObj);
      } else if ('data' in jsonObj) {
        console.log(jsonObj.data);
        keyboardConfigStore.updateExistingConfig({
          configKey: 'user',
          ...jsonObj.data,
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
        {keyboardConfigStore.keyboardToml && keyboardConfigStore.vialJson && (
          <Select
            options={keyboardConfigStore.allPredefinedConfigs.map((config) => ({
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
                  ...allRmkKeyboardConfigs[configKey],
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
            const body = JSON.stringify(
              keyboardConfigStore.getSanitizedConfigData()
            );

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
      {keyboardConfigStore.keyboardToml && (
        <JsonEditor
          data={keyboardConfigStore.keyboardToml}
          collapse={true}
          setData={(data) => {
            keyboardConfigStore.updateExistingConfig({
              keyboardToml: data as IKeyboardTomlConfig,
            });
          }}
        />
      )}

      <h2>Edit your vial.json</h2>
      {keyboardConfigStore.vialJson && (
        <JsonEditor
          data={keyboardConfigStore.vialJson}
          collapse={true}
          setData={(data) =>
            keyboardConfigStore.updateExistingConfig({
              vialJson: data as IVialJSONConfig,
            })
          }
        />
      )}

      <EnumValueSelector
        title="Select RmkKeyboard type"
        defaultX={keyboardConfigStore.keyboard_type}
        enumObj={RmkKeyboardTypes}
      />
      <EnumValueSelector
        title={'Select RmkMcuFamily type'}
        defaultX={keyboardConfigStore.microcontroller_family}
        enumObj={RmkMcuFamily}
      />
      <EnumValueSelector
        title="Select RmkMcus type"
        defaultX={keyboardConfigStore.split_microcontroller}
        enumObj={RmkMcus}
      />
      <EnumValueSelector
        title="Select RmkConnection type"
        defaultX={keyboardConfigStore.connection}
        enumObj={RmkConnectionTypes}
      />
      <EnumValueSelector
        title="Select RustCompilationTargets type"
        defaultX={keyboardConfigStore.target}
        enumObj={RmkRustCompilationTargets}
      />
    </div>
  );
}

function EnumValueSelector(props: {
  title: string;
  defaultX: undefined | string;
  enumObj:
    | typeof RmkRustCompilationTargets
    | typeof RmkKeyboardTypes
    | typeof RmkMcuFamily
    | typeof RmkMcus
    | typeof RmkConnectionTypes;
}) {
  return (
    props.defaultX && (
      <>
        <h3>{props.title}</h3>
        <Select
          shouldDisableUnselected={true}
          options={getEnumKeysAndValues(props.enumObj).map(
            ({ key, value }) => ({
              label: key,
              value: value,
            })
          )}
          value={props.defaultX}
          onChange={() => {}}
        />
      </>
    )
  );
}
