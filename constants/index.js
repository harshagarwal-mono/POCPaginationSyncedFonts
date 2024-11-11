export const ASSETS_SOURCES = {
  ADOBE: "Adobe",
  SYSTEM: "System",
  USER: "User",
  MONOTYPE: "MonotypeFonts",
  IMPORTED: "ImportedFonts",
  CUSTOM: "CustomFonts",
};

export const ASSET_STATES = {
  ACTIVATED: 'activated',
  ACTIVATING: 'activating',
  DEACTIVATED: 'deactivated',
  DEACTIVATING: 'deactivating',
  INSTALLING: 'installing',
  UNINSTALLING: 'uninstalling',
  UNINSTALLED: 'uninstalled',
  INSTALL_FAILED: 'install_failed',
  RETRYING: 'retrying',
};

export const defaultFontListActivationStatus = {
  isActivated: false,
  isActivating: false,
  isDeactivating: false,
  isPartialActivated: false,
  isInstalling: false,
  isUninstalling: false,
  activatedFonts: [],
  deactivatedFonts: [],
  installedFonts: [],
  uninstalledFonts: [],
  installFailedFonts: [],
  installingFonts: [],
  uninstallingFonts: [],
  retryingFonts: [],
  activatingFonts: [],
  deactivatingFonts: [],
  totalFontsCount: 0,
  lockedActivatedFonts: [],
  lockedDeactivatedFonts: [],
};
