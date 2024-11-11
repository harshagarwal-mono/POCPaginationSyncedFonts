import {
  pipe,
  reduce,
  keys,
  values,
  pick,
  flatten,
  uniq,
  propOr,
  curry,
  filter,
} from "ramda";
import { isNotNilOrEmpty } from "./common.js";
import { ASSETS_SOURCES } from "../constants/index.js";

const { ADOBE, MONOTYPE, USER, SYSTEM, IMPORTED, CUSTOM } = ASSETS_SOURCES;
const sourceIdToAllowedResourcesMap = {
  local: [USER, SYSTEM],
  adobe: [ADOBE],
  imported: [IMPORTED],
  custom: [CUSTOM],
  monotype: [MONOTYPE],
};

/**
 * convert source ids to allowed resources
 * @param {Array<String>} sourceFilterIds - selected source filter ids
 * @returns {Object<String, Boolean>} allowed resources map where key is resource id and value is true
 */
export const convertSourceIdsToAllowedResources = (sourceFilterIds) =>
  pipe(
    pick(sourceFilterIds),
    values,
    flatten,
    uniq,
    reduce((acc, source) => {
      acc[source] = true;
      return acc;
    }, {})
  )(sourceIdToAllowedResourcesMap);

/**
 * Filter assets by source selection
 * @param {Array<String>} sourceFilterIds - selected source filter ids
 * @param {Array<Object>} assets - families to be filtered with fonts
 * @returns {Object} - filtered assets and count of filtered fonts by source
 */
export const filterAssetsBySourceSelection = curry(
  (sourceFilterIds, assets) => {
    /**
     * If no source filter is selected, return all assets
     * For Monotype fonts, we need to apply filter at font level as family source may be changed
     * e.g. a family having only 1 custom fonts, what if that got unsynced.
     * and also in case of monotype fonts filter, we have to check families wth custom source as they
     * may have monotype fonts.
     * Even though this will increase some performance overhead, but we do have the fitering loading state
     * and we disable other filters while computation for filter is in progress.
     */
    if (sourceFilterIds.length === 0) {
      return {};
    }

    const allowedSources = convertSourceIdsToAllowedResources(sourceFilterIds);
    const filterFontBySource = (fontData) =>
      propOr(false, fontData.source, allowedSources);

    return reduce(
      (acc, familyId) => {
        const { fonts } = assets[familyId];
        const filteredFonts = filter(filterFontBySource, fonts);

        if (isNotNilOrEmpty(filteredFonts)) {
          acc[familyId] = {
            ...assets[familyId],
            fonts: filteredFonts,
          };
        }

        return acc;
      },
      {},
      keys(assets)
    );
  }
);

export default {
  filterAssetsBySourceSelection,
  convertSourceIdsToAllowedResources,
};
