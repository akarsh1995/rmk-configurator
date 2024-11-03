export enum CookieKey {
  GITHUB_USER_ACCESS_TOKEN = 'github_user_access_token',
  GITHUB_USER_REFRESH_TOKEN = 'github_user_refresh_token',
  GITHUB_INSTALLATION_TOKEN = 'github_installation_token',
  GITHUB_INSTALLATION_ID = 'GITHUB_INSTALLATION_ID',
}

export enum AppUrlPath {
  GH_AUTH = '/api/github',
  GH_REPO = '/api/github/repository/accessibleRepository',
  GH_CONFIG_CONTENT = '/api/github/repository/configContent',
}

export enum RmkEditorErrorCode {
  AUTH_ERROR = 'auth_error',
  MISSING_INSTALLATION_CODE = 'missing_installation_code',
  MISSING_CONFIG_FILES = 'missing_config_files',
  MISSING_QUERY_PARAMS = 'MISSING_QUERY_PARAMS',
}

export enum RmkFilePaths {
  KEYBOARD_TOML = 'keyboard.toml',
  VIAL_JSON = 'vial.json',
  TEMPLATE_CONFIG = 'template-config.toml',
}

export enum RmkTemplateGenerationFlags {
  'split_microcontroller' = 'split_microcontroller',
  'microcontroller_family' = 'microcontroller_family',
  'keyboard_type' = 'keyboard_type',
  'target' = 'target',
  'connection' = 'connection',
  'chip' = 'chip',
}

export enum RmkRustCompilationTargets {
  'ARM Cortex-M0/M0+' = 'thumbv6m-none-eabi',
  'ARM Cortex-M3' = 'thumbv7m-none-eabi',
  'ARM Cortex-M4' = 'thumbv7em-none-eabi',
  'ARM Cortex-M4F' = 'thumbv7em-none-eabihf',
  'ARM Cortex-M33F' = 'thumbv8m.main-none-eabihf',
}

export enum RmkKeyboardTypes {
  split = 'split',
  normal = 'normal',
}

export enum RmkMcus {
  nrf52840 = 'nrf52840',
}
export enum RmkMcuFamily {
  stm32 = 'stm32',
  rp2040 = 'rp2040',
  nrf = 'nrf',
  esp = 'esp',
}

export enum RmkConnectionTypes {
  USB = 'USB',
  BLE = 'BLE',
}
