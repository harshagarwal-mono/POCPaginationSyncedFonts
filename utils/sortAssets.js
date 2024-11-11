import { ascend, curry, descend, prop, sortWith } from "ramda";

export const sortAssets = curry((sortOrder, sortProp, assets) => {
    const sortFunction = sortOrder === 0 ? ascend : descend;
    const sortWithGivenProperty = sortWith([sortFunction(prop(sortProp))]);

    return sortWithGivenProperty(assets);
});

export default {
    sortAssets,
}
