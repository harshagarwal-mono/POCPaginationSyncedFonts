import { isNil, isEmpty, anyPass, complement } from "ramda";

export const isNilOrEmpty = anyPass([isNil, isEmpty]);

export const isNotNilOrEmpty = complement(isNilOrEmpty);

export default {
    isNilOrEmpty,
    isNotNilOrEmpty,
}
