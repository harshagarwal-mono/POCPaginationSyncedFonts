import { ascend, curry, descend, pipe, prop, sortWith, values } from "ramda";

export const sortAssets = curry((sortOrder, sortProp, assets) => {
    const sortFunction = sortOrder === 0 ? ascend : descend;
    const sortWithGivenProperty = sortWith([sortFunction(prop(sortProp))]);

    return pipe(
        values,
        sortWithGivenProperty,
    )(assets);
});

export default {
    sortAssets,
}
