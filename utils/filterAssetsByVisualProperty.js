import { curry, filter, propOr } from "ramda";
import { isNotNilOrEmpty } from "./common.js";

export const getVisualPropertySortedValues = (assets) => {
  const visualProperties = {};

  for (const familyId in assets) {
    const { fonts } = assets[familyId];

    for (const fontId in fonts) {
      const { visualProperties: fontVisualProperties } = fonts[fontId];

      for (const visualProperty in fontVisualProperties) {
        visualProperties[visualProperty] =
          visualProperties[visualProperty] || new Set();
        visualProperties[visualProperty].add(
          fontVisualProperties[visualProperty]
        );
      }
    }
  }

  const visualPropertySortedValues = {};

  for (const visualProperty in visualProperties) {
    visualPropertySortedValues[visualProperty] = Array.from(
      visualProperties[visualProperty]
    ).sort((a, b) => a - b);
  }

  return visualPropertySortedValues;
};

const doesFontExistInAllVpRanges = curry((visualIdRangeMap, font) => {
  const fontVisualProperties = propOr({}, "visualProperties", font);

  for (const visualId in visualIdRangeMap) {
    const [minValue, maxValue] = visualIdRangeMap[visualId];
    const fontValue = propOr(0, visualId, fontVisualProperties);

    if (fontValue < minValue || fontValue > maxValue) {
      return false;
    }
  }

  return true;
});

export const filterAssetsByVisualSelection = curry(
  (sortedVpValueArray, selectedVisualFilters, assets) => {
    // If no style filter selected
    if (selectedVisualFilters.length === 0) {
      return assets;
    }

    const visualIdRangeMap = {};
    selectedVisualFilters.forEach((visual) => {
      const valueRange = sortedVpValueArray[visual.id];
      // if minimum range is 1, then give the first index of the array
      const minIndex = Math.floor(
        (valueRange.length * parseInt(visual.range[0] - 1, 10)) / 100
      );
      const maxIndex = Math.ceil(
        ((valueRange.length - 1) * parseInt(visual.range[1], 10)) / 100
      );

      visualIdRangeMap[visual.id] = [
        valueRange[minIndex],
        valueRange[maxIndex],
      ];
    });

    const filteredFamilies = {};

    for (const familyId in assets) {
      const { fonts } = assets[familyId];
      const filteredFonts = filter(
        doesFontExistInAllVpRanges(visualIdRangeMap),
        fonts
      );

      if (isNotNilOrEmpty(filteredFonts)) {
        filteredFamilies[familyId] = {
          ...assets[familyId],
          fonts: filteredFonts,
        };
      }
    }

    return filteredFamilies;
  }
);

export default {
  filterAssetsByVisualSelection,
  getVisualPropertySortedValues,
};
