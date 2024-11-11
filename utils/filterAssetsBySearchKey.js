import { curry, filter, includes, pipe, replace, toLower, prop } from "ramda";
import { isNilOrEmpty, isNotNilOrEmpty } from "./common.js";

export const filterAssetsBySearchKey = curry((searchKey, assets) => {
  if (isNilOrEmpty(searchKey)) {
    return assets;
  }

  const updatedSearchKey = toLower(searchKey);
  const doesFontNameContainsSearchKey = pipe(
    prop("name"),
    toLower,
    replace(/(™|®|©|&trade;|&reg;|&copy;|&#8482;|&#174;|&#169;)/g, ""),
    includes(updatedSearchKey)
  );
  const filteredAssets = {};
  
  for (const familyId in assets) {
    const { fonts } = assets[familyId];
    const filteredFonts = filter(doesFontNameContainsSearchKey, fonts);

    if (isNotNilOrEmpty(filteredFonts)) {
      filteredAssets[familyId] = {
        ...assets[familyId],
        fonts: filteredFonts,
      };
    }
  }
  return filteredAssets;
});

export default {
  filterAssetsBySearchKey,
};
