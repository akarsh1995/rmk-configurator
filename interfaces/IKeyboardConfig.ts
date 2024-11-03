export interface IKeyboardTomlConfig {
  ble: {
    enabled: boolean;
  };
  keyboard: {
    chip: string;
    manufacturer: string;
    name: string;
    product_id: number;
    product_name: string;
    vendor_id: number;
  };
  layout: {
    keymap: string[][][];
    cols: number;
    rows: number;
    layers: number;
  };
  light: Record<string, unknown>; // Empty object, flexible for future additions
  matrix?: {
    input_pins: string[];
    output_pins: string[];
  };
  split: {
    connection: string;
    peripheral: Array<IPeripheralConfig>;
    central: ICentralConfig;
  };
  storage: Record<string, unknown>; // Empty object, flexible for future additions
}

export interface IPeripheralConfig {
  ble_addr: number[];
  col_offset: number;
  cols: number;
  input_pins: string[];
  output_pins: string[];
  row_offset: number;
  rows: number;
}

export interface ICentralConfig {
  ble_addr: number[];
  col_offset: number;
  cols: number;
  input_pins: string[];
  output_pins: string[];
  row_offset: number;
  rows: number;
}
