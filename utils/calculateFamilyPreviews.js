import { pick, keys,curry } from "ramda";

const THRESHOLD_WEIGHT = 400;

/**
 * returns the priority of incoming font for default font props.
 * @private
 * @param {Style} fontStyle Style of incoming font.
 * @returns {Number} return priority on the basis of style. The lower the number it returns the higher the priority.
 */
const getPriority = (fontStyle) => {
  const style = fontStyle.toLowerCase();

  if (style.includes("regular")) {
    return 5;
  }
  if (style.includes("normal")) {
    return 4;
  }
  if (style.includes("roman")) {
    return 3;
  }
  if (style.includes("italic") || style.includes("oblique")) {
    return 1;
  }
  return 2;
};

/**
 * return updated default Font Props.
 * @public
 * @param {Object} incomingFontInfo  Incoming font properties.
 * @param {Object} currentFontInfo Properties of current default font.
 * @returns {Boolean} return true if default font needs to be updated.
 */
export const isDefaultFontsNeedsToBeUpdated = (
  incomingFontInfo,
  currentFontInfo
) => {
  const { fontStyle, fontWeight } = incomingFontInfo;
  const priorityForIncomingFont = getPriority(fontStyle);
  const priorityForCurrentFont = getPriority(currentFontInfo.fontStyle);
  const incomingFontWeight = parseInt(fontWeight, 10);
  const currentFontWeight = parseInt(currentFontInfo.fontWeight, 10);
  const minimumNumberForIncomingFont = Math.abs(
    incomingFontWeight - THRESHOLD_WEIGHT
  );
  const minimumNumberForCurrentFont = Math.abs(
    currentFontWeight - THRESHOLD_WEIGHT
  );
  const isIncomingFontCloserToThreshold =
    minimumNumberForIncomingFont < minimumNumberForCurrentFont;

  if (
    priorityForIncomingFont === priorityForCurrentFont &&
    isIncomingFontCloserToThreshold
  ) {
    return true;
  }

  return priorityForIncomingFont > priorityForCurrentFont;
};

/**
 * calculate default font id
 * @param {Array} fontIds - array of fontIds
 * @param {Object} fontsInfo - fontsInfo
 * @returns {Object} - default font props
 */
export const calculateDefaultFontProps = (fontIds, fontsInfo) => {
  if (fontIds.length === 0) {
    throw new Error("No fontIds found to calculate default font props");
  }

  let defaultFontId = fontIds[0];

  for (let i = 1; i < fontIds.length; i += 1) {
    if (
      isDefaultFontsNeedsToBeUpdated(
        fontsInfo[fontIds[i]],
        fontsInfo[defaultFontId]
      )
    ) {
      defaultFontId = fontIds[i];
    }
  }

  return pick(
    ["fontStyle", "fontWeight", "id", "fontMd5"],
    fontsInfo[defaultFontId]
  );
};

export const calculateFamilyPreviews = curry((getFamilyState, assets) => {
  const families = {};

  Object.keys(assets).forEach((familyId) => {
    const { fonts: fontsInfo = {}, defaultFontProps } = assets[familyId];

    const fontIds = keys(fontsInfo);
    const { totalFontsCount } = getFamilyState(familyId);
    const updatedDefaultFontProps = calculateDefaultFontProps(fontIds, fontsInfo);

    families[familyId] = {
      ...assets[familyId],
      defaultFontProps: updatedDefaultFontProps,
      filteredFontsCount: fontIds.length,
      totalFontsCount,
    };
  });

  return families;
});

export default {
    calculateFamilyPreviews,
    isDefaultFontsNeedsToBeUpdated,
    calculateDefaultFontProps,
}
