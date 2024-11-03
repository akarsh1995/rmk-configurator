export interface IVialJSONConfig {
  name: string;
  vendorId: string;
  productId: string;
  matrix: {
    rows: number;
    cols: number;
  };
  menus: string[];
  layouts: {
    keymap: Array<Array<IVialKey | string>>;
  };
}

export interface IVialKey {
  x?: number;
  y?: number;
  r?: number;
  rx?: number;
  ry?: number;
  h?: number;
}
