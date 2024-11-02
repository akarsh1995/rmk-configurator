'use client'
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
import { AppUrlPath, RmkEditorErrorCode } from "../utils/enums";
import { getAppURL } from "../lib/app/url";
import { IApiResponse } from "../interfaces/IApiResponse";


// Dynamically import the component
const JsonEditor = dynamic(() => import('../components/editor'), {ssr: false});


type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};


export default function Home() {
  const [authUrl, setAuthUrl] = useState<string>()
  const [repos, setRepos] = useState<{ name: string; owner: string }[]>([])

  const options = repos.map(r => ({
    label: `${r.owner}/${r.name}`,
    value: `${r.owner}/${r.name}`,
  }))

  const [toml, setToml] = useState({});
  const [vial, setVial] = useState({});
  const [selectedOption, setSelectedOption] = useState<string>(options.length ? options[0].value : '');


  const fetchRepositories = async () => {
    const url = getAppURL(AppUrlPath.GH_REPO);
    const results = await fetch(url);
    const jsonObj: IApiResponse<{ name: string, owner: string; }[]> = await results.json();

    if ('error' in jsonObj && jsonObj.error.code === RmkEditorErrorCode.MISSING_INSTALLATION_CODE) {
      setAuthUrl(getAppURL(AppUrlPath.GH_AUTH));
    } else if ('data' in jsonObj && jsonObj.data.length) {
      setRepos(jsonObj.data);
      const r = jsonObj.data[0];
      setSelectedOption(`${r.owner}/${r.name}`)
    }
  }


  useEffect(() => {
    fetchRepositories()
  }, [])

  const getConfigContent = async () => {
    const configContentUrl = getAppURL(AppUrlPath.GH_CONFIG_CONTENT)
    const [owner, repo] = selectedOption.split('/');
    if (owner && repo) {

      const results = await fetch(`${configContentUrl}?owner=${owner}&repo=${repo}`);
      const jsonObj: IApiResponse<{ keyboardToml: object; vialJson: object; }> = await results.json();

      if ('error' in jsonObj && jsonObj.error.code === RmkEditorErrorCode.MISSING_CONFIG_FILES) {
        console.log(jsonObj);
      } else if ('data' in jsonObj) {
        const parsedKeyboardToml = (((jsonObj.data.keyboardToml)));
        const parsedVialJson = (((jsonObj.data.vialJson)));
        setToml(parsedKeyboardToml)
        setVial(parsedVialJson)
      }
    }
  }

  useEffect(() => {
    getConfigContent();
  }, [repos, selectedOption])


  return (
    <div>
      {repos.length && <Select options={options} value={selectedOption} onChange={setSelectedOption} />}
      <div>{authUrl && <a href={authUrl}>github connect</a>}</div>
      <br/>
      {repos.length && <button onClick={async () => {
        const configContentUrl = getAppURL(AppUrlPath.GH_CONFIG_CONTENT)
        const [owner, repo] = selectedOption.split('/');

        const body = JSON.stringify({
            keyboardToml: toml,
            vialJson: vial,
        });

        const response = await fetch(`${configContentUrl}?owner=${owner}&repo=${repo}`, {
          method: 'POST', // Specify the request method
          headers: {
            'Content-Type': 'application/json' // Set the headers, especially if sending JSON
          },
          body  // Convert the data to a JSON string
        });
        console.log(response);
      }}>Save Config</button>}
      <h2>Edit your keyboard.toml</h2>
      <JsonEditor data={vial} setData={setVial} />
      <h2>Edit your vial.json</h2>
      <JsonEditor data={toml} setData={setToml} />
    </div>
  );
}

