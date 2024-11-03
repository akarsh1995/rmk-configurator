import { IRmkConfig } from '@/interfaces/IRmkConfig';
import { allRmkKeyboardConfigs } from '@/lib/config/allKeyboards';
import { create } from 'zustand';

interface IKeyboardConfigStore extends IRmkConfig {
  allPredefinedConfigs: string[];
  configKey: string;
  updateExistingConfig: (data: Partial<IKeyboardConfigStore>) => void;
  getSanitizedConfigData: () => IRmkConfig;
}

export const useKeyboardConfigStore = create<IKeyboardConfigStore>()(
  (set, get) => ({
    allPredefinedConfigs: [...Object.keys(allRmkKeyboardConfigs), 'user'],
    configKey: 'user',
    updateExistingConfig: (data: Partial<IKeyboardConfigStore>) =>
      set(() => ({ ...data })),
    getSanitizedConfigData: (): IRmkConfig => {
      return {
        keyboardToml: get().keyboardToml,
        vialJson: get().vialJson,
        keyboard_type: get().keyboard_type,
        microcontroller_family: get().microcontroller_family,
        split_microcontroller: get().split_microcontroller,
        connection: get().connection,
        target: get().target,
      };
    },
  })
);
