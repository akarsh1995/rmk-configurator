export enum CookieKey {
  GITHUB_USER_ACCESS_TOKEN = 'github_user_access_token',
  GITHUB_USER_REFRESH_TOKEN = 'github_user_refresh_token',
  GITHUB_INSTALLATION_TOKEN = 'github_installation_token',
  GITHUB_INSTALLATION_ID = 'GITHUB_INSTALLATION_ID'
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
  MISSING_QUERY_PARAMS = "MISSING_QUERY_PARAMS",
}

export enum RmkFilePaths {
  KEYBOARD_TOML = 'keyboard.toml',
  VIAL_JSON = 'vial.json'
}
