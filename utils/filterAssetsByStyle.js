import { curry, filter, intersection, lt, propSatisfies, pipe, propOr } from "ramda";
import { isNotNilOrEmpty } from "./common.js";

export const filterAssetsByStyleSelection = curry((selectedStyles, assets) => {
  // If no style filter selected
  if (selectedStyles.length === 0) {
    return assets;
  }

  const filteredFamilies = {};
  const doesFontContainAnyOfSelectedStyle = pipe(
    propOr([], "tags"),
    intersection(selectedStyles),
    propSatisfies(lt(0), "length"),
  );

  for (const familyId in assets) {
    const { fonts } = assets[familyId];
    const filteredFonts = filter(doesFontContainAnyOfSelectedStyle)(fonts);

    if (isNotNilOrEmpty(filteredFonts)) {
      filteredFamilies[familyId] = {
        ...assets[familyId],
        fonts: filteredFonts,
      };
    }
  }

  return filteredFamilies;
});

export default {
  filterAssetsByStyleSelection,
};
