import { curry, filter, intersection, propEq, pipe, propOr } from "ramda";
import { isNotNilOrEmpty } from "./common.js";

export const filterAssetsByLanguageSelection = curry((selectedLanguages, assets) => {
  const doesFontContainsAllSelectedLanguages = pipe(
    propOr([], "languages"),
    intersection(selectedLanguages),
    propEq(selectedLanguages.length, "length")
  );

  // If no language filter selected, return assets with no lang filter selected
  if (selectedLanguages.length === 0) {
    return assets;
  }

  const filteredFamilies = {};

  for (const familyId in assets) {
    const { fonts } = assets[familyId];
    const filteredFonts = filter(doesFontContainsAllSelectedLanguages)(fonts);

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
  filterAssetsByLanguageSelection,
};
