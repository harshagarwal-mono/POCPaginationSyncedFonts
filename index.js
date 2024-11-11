import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { pipe, values } from "ramda";
import { filterAssetsByActivationStatus } from './utils/filterAssetsByActivationStatus.js';
import { filterAssetsBySearchKey } from './utils/filterAssetsBySearchKey.js';
import { filterAssetsByStyleSelection } from './utils/filterAssetsByStyle.js';
import { filterAssetsByLanguageSelection } from './utils/filterAssetsByLanguage.js';
import { filterAssetsBySourceSelection } from './utils/filterAssetsBySource.js';
import { filterAssetsByVisualSelection, getVisualPropertySortedValues } from './utils/filterAssetsByVisualProperty.js';
import { calculateFamilyPreviews } from './utils/calculateFamilyPreviews.js';
import { getFontListActivationStatus } from './utils/getFontListActvationStatus.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stateDataPath = path.join(__dirname, "data", "state.json");

const defaultMinima = 1;
const defaultMaxima = 100;
const fontVisualTreeStructure = {
    weight: {
      name: 'FILTER.enhancedCatalog.visualProperties.WEIGHT',
      id: 'weight',
      isEnable: false,
      range: [defaultMinima, defaultMaxima],
      rangeValues: {
        Hairline: { start: 0, end: 0.1 },
        Thin: { start: 0.1, end: 0.15 },
        'Extra Light': { start: 0.15, end: 0.2 },
        Light: { start: 0.2, end: 0.23 },
        'Semi Light': { start: 0.23, end: 0.25 },
        Regular: { start: 0.25, end: 0.35 },
        'Semi Bold': { start: 0.35, end: 0.4 },
        Bold: { start: 0.4, end: 0.5 },
        'Extra Bold': { start: 0.5, end: 0.6 },
        Black: { start: 0.6, end: 0.65 },
        'Ultra Black': { start: 0.65, end: 1 },
      },
    },
    width: {
      name: 'FILTER.enhancedCatalog.visualProperties.WIDTH',
      id: 'width',
      isEnable: false,
      range: [defaultMinima, defaultMaxima],
      rangeValues: {
        'Ultra Condensed': { start: 0, end: 800 },
        'Extra Condensed': { start: 800, end: 1000 },
        Condensed: { start: 1000, end: 1150 },
        'Semi Condensed': { start: 1150, end: 1300 },
        Normal: { start: 1300, end: 1500 },
        'Semi Extended': { start: 1500, end: 1600 },
        Extended: { start: 1600, end: 2000 },
        'Extra Extended': { start: 2000, end: 2500 },
        'Ultra Extended': { start: 2500, end: Infinity },
      },
    },
    'x-height': {
      name: 'FILTER.enhancedCatalog.visualProperties.X_HEIGHT',
      id: 'x-height',
      isEnable: false,
      range: [defaultMinima, defaultMaxima],
      rangeValues: {
        Small: { start: 0, end: 0.68 },
        Medium: { start: 0.68, end: 0.76 },
        Large: { start: 0.76, end: Infinity },
      },
    },
    slant: {
      name: 'FILTER.enhancedCatalog.visualProperties.SLANT',
      id: 'slant',
      isEnable: false,
      range: [defaultMinima, defaultMaxima],
      rangeValues: {
        Negative: { start: -Infinity, end: -0.1 },
        None: { start: 0, end: 1 },
        Small: { start: 1, end: 3 },
        Medium: { start: 3, end: 10 },
        Large: { start: 10, end: 25 },
        Extreme: { start: 25, end: Infinity },
      },
    }
  };
const selectedVisualFilters = values(fontVisualTreeStructure);
const selectedStyles = [
  "c1",
  "5",
  "6",
  "7",
  "c2",
  "1",
  "10",
  "11",
  "13",
  "c6",
  "c4",
  "0",
  "3",
  "8",
  "14",
  "12",
].map((x) => `Œ${x}`);
const searchKey = "";
const activationStatusFilterMap = {
  activated: true,
  activating: true,
  deactivated: true,
  deactivating: true,
  installing: true,
  uninstalling: true,
  uninstalled: true,
  install_failed: true,
  retrying: true,
};
const selectedLanguages = ['en'];
const selectedSources = ['monotype', 'custom', 'imported', 'adobe', 'local'];

const main = async () => {
  const stateDataRaw = await fs.promises.readFile(stateDataPath, "utf8");
  const stateData = JSON.parse(stateDataRaw);
  const {
    objects: { fontsFamilies, fonts },
  } = stateData;
  const allFamilies = {};

  for (const fontId in fonts) {
    const { familyId } = fonts[fontId];
    allFamilies[familyId] = allFamilies[familyId] || {
      ...fontsFamilies[familyId],
      fonts: {},
    };
    allFamilies[familyId].fonts[fontId] = fonts[fontId];
  }

  const getFontState = (id) => stateData.states.fonts[id].state;
  const getFamilyState = (id) => stateData.states.fontsFamilies[id].activationStatus;

  console.time("compose");

  console.time("getVisualPropertySortedValues");

  const sortedVpValueArray = getVisualPropertySortedValues(allFamilies);

  console.timeEnd("getVisualPropertySortedValues");

  console.time("filterFonts");

  const filteredFonts = pipe(
    filterAssetsByStyleSelection(selectedStyles),
    filterAssetsByVisualSelection(sortedVpValueArray, selectedVisualFilters),
    filterAssetsBySourceSelection(selectedSources),
    filterAssetsByActivationStatus(activationStatusFilterMap, getFontState),
    filterAssetsByLanguageSelection(selectedLanguages),
    filterAssetsBySearchKey(searchKey),
  )(allFamilies);

  console.timeEnd("filterFonts");

  console.time("calculateFamilyPreviews");

  const familiesWithPreviews = calculateFamilyPreviews(getFamilyState, filteredFonts);

  console.timeEnd("calculateFamilyPreviews");

  console.time("getFontListActivationStatus");

  const fontListActivationStatus = getFontListActivationStatus(getFontState, familiesWithPreviews);

  console.timeEnd("getFontListActivationStatus");

  console.timeEnd("compose");
};

main();
