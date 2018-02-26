var ofLength = R.curry(function (proto, comparitor, length, x) {
    return R.allPass([R.is(proto), R.compose(R[comparitor](R.__, length), R.length)])(x);
});

var modTwoEq = function modTwoEq(v) {
    return R.compose(R.equals(v), R.mathMod(R.__, 2));
};

function _interopDefault(r) {
    return r && "object" == typeof r && "default" in r ? r.default : r
}

var isArray = R.is(Array), isArrayOfLength = ofLength(Array, 'identical'),
    isArrayOfLengthAtLeast = ofLength(Array, 'gte'),
    isArrayOfLengthAtMost = ofLength(Array, 'lte'),
    isArrayLongerThan = ofLength(Array, 'gt'),
    isArrayShorterThan = ofLength(Array, 'lt'),
    isArrayContaining = R.contains(R.__),
    isEmptyArray = R.allPass([R.is(Array), R.isEmpty]);

var isNumberBetween = R.curry(function (min, max, n) {
    return R.is(Number, n) && n > min && n < max;
});

var isNumberBetweenInclusive = R.curry(function (min, max, n) {
    return R.is(Number, n) && n >= min && n <= max;
});

var numberIsOneOf = R.curry(function (selectionArr, num) {
    return R.allPass([R.is(Number), R.contains(R.__, selectionArr)])(num);
});

var isNumber = R.is(Number),
    isPositiveNumber = R.allPass([isNumber, R.gt(R.__, 0)]),
    isAtLeastZero = R.allPass([isNumber, R.gte(R.__, 0)]),
    isNegativeNumber = R.allPass([isNumber, R.lt(R.__, 0)]),
    isAtMostZero = R.allPass([isNumber, R.lte(R.__, 0)]),
    isCalendarMonth = isNumberBetweenInclusive(1, 12),
    isCalendarMonthZeroBased = isNumberBetweenInclusive(0, 11),
    isEvenNumber = modTwoEq(0),
    isOddNumber = modTwoEq(1),
    isNumeric = function isNumeric(v) {
        return !isNaN(parseInt(v, 10));
    },
    isNumericBoolean = R.contains(R.__, [0, 1]);

var isObject = R.is(Object),
    isObjectContaining = R.has,
    isObjectAbsent = R.curry(function (k, o) {
    return R.is(Object, o) && !R.has(k, o);
}), isObjectMatching = R.tryCatch(R.equals, R.F),
    isObjectExtending = R.tryCatch(R.whereEq, R.F),
    isObjectSatisfying = R.tryCatch(R.where, R.F);

var isString = R.is(String),
    isStringOfLength = ofLength(String, 'identical'),
    isStringOfLengthAtLeast = ofLength(String, 'gte'),
    isStringOfLengthAtMost = ofLength(String, 'lte'),
    isStringLongerThan = ofLength(String, 'gt'),
    isStringShorterThan = ofLength(String, 'lt');

var isStringContaining = R.curry(function (subStr, str) {
    return R.compose(R.not, R.equals(-1), R.indexOf(subStr))(str);
});

var isStringMatching = R.curry(function (pattern, str) {
    return R.test(pattern, str);
});

var stringIsOneOf = R.curry(function (selectionArr, str) {
    return R.allPass([R.is(String), R.contains(R.__, selectionArr)])(str);
});

var isStringOfLengthBetween = R.curry(function (min, max, str) {
    return R.both(isStringLongerThan(min), isStringShorterThan(max))(str);
});

var isStringOfLengthBetweenInclusive = R.curry(function (min, max, str) {
    return R.both(isStringOfLengthAtLeast(min), isStringOfLengthAtMost(max))(str);
});

var isEmail = R.test(/\S+@\S+/);

var isNumericString = function isNumericString(str) {
    return isString(str) && !isNaN(parseInt(str, 10));
};

var isTimestamp = R.test(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/);

var isJSON = function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return R.is(String, str);
};

var prettycats = {
    isString: isString,
    isStringOfLength: isStringOfLength,
    isStringOfLengthAtLeast: isStringOfLengthAtLeast,
    isStringOfLengthAtMost: isStringOfLengthAtMost,
    isStringLongerThan: isStringLongerThan,
    isStringShorterThan: isStringShorterThan,
    isStringOfLengthBetween: isStringOfLengthBetween,
    isStringOfLengthBetweenInclusive: isStringOfLengthBetweenInclusive,
    isStringContaining: isStringContaining,
    isStringMatching: isStringMatching,
    stringIsOneOf: stringIsOneOf,
    isEmail: isEmail,
    isTimestamp: isTimestamp,
    isNumericString: isNumericString,
    isJSON: isJSON,
    isNumber: isNumber,
    isPositiveNumber: isPositiveNumber,
    isNegativeNumber: isNegativeNumber,
    isAtLeastZero: isAtLeastZero,
    isAtMostZero: isAtMostZero,
    isCalendarMonth: isCalendarMonth,
    isCalendarMonthZeroBased: isCalendarMonthZeroBased,
    isNumberBetween: isNumberBetween,
    isNumberBetweenInclusive: isNumberBetweenInclusive,
    isEvenNumber: isEvenNumber,
    isOddNumber: isOddNumber,
    isNumeric: isNumeric,
    isNumericBoolean: isNumericBoolean,
    numberIsOneOf: numberIsOneOf,
    isArray: isArray,
    isEmptyArray: isEmptyArray,
    isArrayOfLength: isArrayOfLength,
    isArrayOfLengthAtLeast: isArrayOfLengthAtLeast,
    isArrayOfLengthAtMost: isArrayOfLengthAtMost,
    isArrayLongerThan: isArrayLongerThan,
    isArrayShorterThan: isArrayShorterThan,
    isArrayContaining: isArrayContaining,
    isObject: isObject,
    isObjectContaining: isObjectContaining,
    isObjectAbsent: isObjectAbsent,
    isObjectMatching: isObjectMatching,
    isObjectExtending: isObjectExtending,
    isObjectSatisfying: isObjectSatisfying
};