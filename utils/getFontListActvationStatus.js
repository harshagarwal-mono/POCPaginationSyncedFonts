import { always, clone, curry, mergeAll, pipe, pluck, values } from 'ramda';
import { ASSET_STATES, defaultFontListActivationStatus } from '../constants/index.js';

const {
    ACTIVATED,
    ACTIVATING,
    DEACTIVATED,
    DEACTIVATING,
    RETRYING,
    INSTALLING,
    UNINSTALLING,
    UNINSTALLED,
    INSTALL_FAILED,
  } = ASSET_STATES;

  export const getComputedActivationStatusProps = (activationStatus) => {
    const {
      installingFonts,
      uninstallingFonts,
      activatingFonts,
      deactivatingFonts,
      activatedFonts,
      totalFontsCount,
      lockedActivatedFonts = [],
      lockedDeactivatedFonts = [],
    } = activationStatus;
    const lockedFontsCount =
      lockedActivatedFonts.length + lockedDeactivatedFonts.length;
    const activationCount = activatedFonts.length;
    const isActivated = activationCount + lockedFontsCount === totalFontsCount;
    const isPartialActivated = !isActivated && activationCount > 0;
  
    return {
      isActivated,
      isPartialActivated,
      isDeactivated: activationCount === 0,
      isInstalling: installingFonts.length > 0,
      isActivating: activatingFonts.length > 0,
      isDeactivating: deactivatingFonts.length > 0,
      isUninstalling: uninstallingFonts.length > 0,
    };
  };

export const getFontListActivationStatus = curry((getFontState, assets) => {
    const stateToActiongetTargetMap = {
        [ACTIVATED]:  ({ locked }) => ([locked ? 'lockedActivatedFonts'  : 'activatedFonts', 'installedFonts']),
        [DEACTIVATED]:({ locked })  => ([locked ? 'lockedDeactivatedFonts' : 'deactivatedFonts' , 'installedFonts']),
        [UNINSTALLED]: always(['uninstalledFonts']),
        [ACTIVATING]: always(['installedFonts', 'activatingFonts']),
        [DEACTIVATING]: always(['installedFonts', 'deactivatingFonts']),
        [INSTALL_FAILED]: always(['installFailedFonts', 'installedFonts']),
        [INSTALLING]: always(['installingFonts']),
        [RETRYING]: always(['retryingFonts', 'installingFonts']),
        [UNINSTALLING]: always(['uninstallingFonts']),
    };

    const fonts = pipe(
        values,
        pluck('fonts'),
        mergeAll,
    )(assets);
    const fontListActivationStatus = clone(defaultFontListActivationStatus);

    for (const fontId in fonts) {
        const { familyId } = fonts[fontId];
        const fontState = getFontState(fontId);
        const arrNames = stateToActiongetTargetMap[fontState](fonts[fontId]);
        
        arrNames.forEach((arrName) => {
            fontListActivationStatus[arrName].push({
                fontId,
                familyId,
            });
        });
        fontListActivationStatus.totalFontsCount += 1;
    }

    return {
        ...fontListActivationStatus,
        ...getComputedActivationStatusProps(fontListActivationStatus),
    };
});
