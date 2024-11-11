import { curry, filter, intersection, propEq, pipe, propOr } from "ramda";

export const filterAssetsByLanguageSelection = curry((selectedLanguages, assets) => {
  const doesFamilyContainsAllSelectedLanguages = pipe(
    propOr([], "languages"),
    intersection(selectedLanguages),
    propEq(selectedLanguages.length, "length")
  );

  // If no language filter selected, return assets with no lang filter selected
  if (selectedLanguages.length === 0) {
    return assets;
  }

  return filter(doesFamilyContainsAllSelectedLanguages)(assets);
});

export default {
  filterAssetsByLanguageSelection,
};
