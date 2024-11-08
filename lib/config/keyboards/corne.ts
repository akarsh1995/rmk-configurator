import { IKeyboardTomlConfig } from '@/interfaces/IKeyboardConfig';
import { IRmkConfig } from '@/interfaces/IRmkConfig';
import { IVialJSONConfig } from '@/interfaces/IVialConfig';
import {
  RmkKeyboardTypes,
  RmkMcuFamily,
  RmkMcus,
  RmkConnectionTypes,
  RmkRustCompilationTargets,
} from '@/utils/enums';

const keyboardToml: IKeyboardTomlConfig = {
  ble: {
    enabled: true,
  },
  keyboard: {
    chip: 'nrf52840',
    manufacturer: 'haobo',
    name: 'RMK Keyboard',
    product_id: 17987,
    product_name: 'RMK Keyboard',
    vendor_id: 19531,
  },
  layout: {
    cols: 6,
    layers: 3,
    rows: 8,
    keymap: [
      [
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
      ],
      [
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
      ],
      [
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_'],
      ],
    ],
  },
  light: {},
  split: {
    connection: 'ble',
    peripheral: [
      {
        ble_addr: [126, 254, 115, 158, 102, 227],
        col_offset: 0,
        cols: 6,
        input_pins: ['P0_22', 'P0_24', 'P1_00', 'P0_11'],
        output_pins: ['P1_11', 'P1_13', 'P1_15', 'P0_02', 'P0_29', 'P0_31'],
        row_offset: 4,
        rows: 4,
      },
    ],
    central: {
      ble_addr: [24, 226, 33, 128, 192, 199],
      col_offset: 0,
      cols: 6,
      input_pins: ['P0_22', 'P0_24', 'P1_00', 'P0_11'],
      output_pins: ['P0_31', 'P0_29', 'P0_02', 'P1_15', 'P1_13', 'P1_11'],
      row_offset: 0,
      rows: 4,
    },
  },
  storage: {},
};

const vialJson: IVialJSONConfig = {
  name: 'Corne',
  vendorId: '0x4653',
  productId: '0x0001',
  matrix: {
    rows: 8,
    cols: 6,
  },
  menus: ['qmk_rgblight'],
  layouts: {
    keymap: [
      [
        {
          y: 1,
          x: 3.5,
        },
        '0,3',
        {
          x: 7.5,
        },
        '4,3',
      ],
      [
        {
          y: -0.875,
          x: 2.5,
        },
        '0,2',
        {
          x: 1,
        },
        '0,4',
        {
          x: 5.5,
        },
        '4,4',
        {
          x: 1,
        },
        '4,2',
      ],
      [
        {
          y: -0.875,
          x: 5.5,
        },
        '0,5',
        {
          x: 3.5,
        },
        '4,5',
      ],
      [
        {
          y: -0.875,
          x: 0.5,
        },
        '0,0',
        '0,1',
        {
          x: 11.5,
        },
        '4,1',
        '4,0',
      ],
      [
        {
          y: -0.375,
          x: 3.5,
        },
        '1,3',
        {
          x: 7.5,
        },
        '5,3',
      ],
      [
        {
          y: -0.875,
          x: 2.5,
        },
        '1,2',
        {
          x: 1,
        },
        '1,4',
        {
          x: 5.5,
        },
        '5,4',
        {
          x: 1,
        },
        '5,2',
      ],
      [
        {
          y: -0.875,
          x: 5.5,
        },
        '1,5',
        {
          x: 3.5,
        },
        '5,5',
      ],
      [
        {
          y: -0.875,
          x: 0.5,
        },
        '1,0',
        '1,1',
        {
          x: 11.5,
        },
        '5,1',
        '5,0',
      ],
      [
        {
          y: -0.375,
          x: 3.5,
        },
        '2,3',
        {
          x: 7.5,
        },
        '6,3',
      ],
      [
        {
          y: -0.875,
          x: 2.5,
        },
        '2,2',
        {
          x: 1,
        },
        '2,4',
        {
          x: 5.5,
        },
        '6,4',
        {
          x: 1,
        },
        '6,2',
      ],
      [
        {
          y: -0.875,
          x: 5.5,
        },
        '2,5',
        {
          x: 3.5,
        },
        '6,5',
      ],
      [
        {
          y: -0.875,
          x: 0.5,
        },
        '2,0',
        '2,1',
        {
          x: 11.5,
        },
        '6,1',
        '6,0',
      ],
      [
        {
          y: -0.125,
          x: 4,
        },
        '3,3',
        {
          x: 6.5,
        },
        '7,3',
      ],
      [
        {
          r: 15,
          rx: 4.5,
          ry: 9.1,
          y: -4.85,
          x: -0.5,
        },
        '3,4',
      ],
      [
        {
          r: 30,
          rx: 5.4,
          ry: 9.3,
          y: -5.05,
          x: -1.4,
          h: 1.5,
        },
        '3,5',
      ],
      [
        {
          r: -30,
          rx: 11.1,
          y: -5.05,
          x: 0.4,
          h: 1.5,
        },
        '7,5',
      ],
      [
        {
          r: -15,
          rx: 12,
          ry: 9.1,
          y: -4.85,
          x: -0.5,
        },
        '7,4',
      ],
    ],
  },
};

const rmkConfigCorne: IRmkConfig = {
  keyboardToml: keyboardToml,
  vialJson: vialJson,
  keyboard_type: RmkKeyboardTypes.split,
  microcontroller_family: RmkMcuFamily.nrf,
  split_microcontroller: RmkMcus.nrf52840,
  connection: RmkConnectionTypes.BLE,
  target: RmkRustCompilationTargets['ARM Cortex-M4F'],
};

export default rmkConfigCorne;
