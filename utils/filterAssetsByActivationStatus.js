import { values, forEach, filter, equals, curry, pipe, all } from "ramda";
import { isNilOrEmpty } from "./common.js";

/**
 * Filter assets by activation status
 * @param {Array<Object>} assets - families to be filtered with fonts
 * @param {Object<string, bool>} activationStatusFilterMap - activation status filter map where key is activation status and value is a boolean
 * @param {Function} getFontState - function to get font activation state
 * @returns {Object} - filtered assets
 */
export const filterAssetsByActivationStatus = curry((
  activationStatusFilterMap,
  getFontState,
  assets,
) => {
  const filteredAssets = {};
  const isAllActvationStatusSelected = pipe(
    values,
    all(equals(true))
  )(activationStatusFilterMap);

  if (isAllActvationStatusSelected) {
    return assets;
  }

  forEach((family) => {
    const { familyId, fonts } = family;
    const filteredFonts = filter(({ id: fontId }) => {
      const activationState = getFontState(fontId);
      return activationStatusFilterMap[activationState];
    })(fonts);

    if (isNilOrEmpty(filteredFonts)) {
      return;
    }

    filteredAssets[familyId] = {
      ...family,
      fonts: filteredFonts,
    };
  }, values(assets));

  return filteredAssets;
});

export default {
  filterAssetsByActivationStatus,
};
