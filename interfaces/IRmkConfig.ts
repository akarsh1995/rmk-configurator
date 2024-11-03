import {
  RmkKeyboardTypes,
  RmkMcuFamily,
  RmkMcus,
  RmkConnectionTypes,
  RmkRustCompilationTargets,
} from '@/utils/enums';
import { IKeyboardTomlConfig } from './IKeyboardConfig';
import { IVialJSONConfig } from './IVialConfig';

export interface IRmkConfig {
  keyboardToml?: IKeyboardTomlConfig;
  vialJson?: IVialJSONConfig;
  keyboard_type?: RmkKeyboardTypes;
  microcontroller_family?: RmkMcuFamily;
  split_microcontroller?: RmkMcus;
  connection?: RmkConnectionTypes;
  target?: RmkRustCompilationTargets;
}
