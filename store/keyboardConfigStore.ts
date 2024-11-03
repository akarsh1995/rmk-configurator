import { IKeyboardTomlConfig } from '@/interfaces/IKeyboardConfig';
import { IRmkConfig } from '@/interfaces/IRmkConfig';
import { IVialJSONConfig } from '@/interfaces/IVialConfig';
import { allRmkKeyboardConfigs } from '@/lib/config/allKeyboards';
import { create } from 'zustand';

interface IKeyboardConfigStore {
  allConfigs: string[];
  configKey: string;
  toml?: IKeyboardTomlConfig;
  vial?: IVialJSONConfig;
  updateExistingConfig: ({
    toml,
    vial,
    configKey,
  }: {
    toml?: IKeyboardTomlConfig;
    vial?: IVialJSONConfig;
    configKey?: string;
  }) => void;
}

export const useKeyboardConfigStore = create<IKeyboardConfigStore>()((set) => ({
  allConfigs: [...Object.keys(allRmkKeyboardConfigs), 'user'],
  configKey: 'user',
  toml: undefined,
  vial: undefined,
  updateExistingConfig: ({
    toml,
    vial,
    configKey,
  }: {
    toml?: IKeyboardTomlConfig;
    vial?: IVialJSONConfig;
    configKey?: string;
  }) =>
    set((state) => {
      return {
        toml: toml || state.toml,
        vial: vial || state.vial,
        configKey: configKey || state.configKey,
      };
    }),
}));
