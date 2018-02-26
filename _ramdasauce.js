"use strict";

function _interopDefault(r) {
    return r && "object" == typeof r && "default" in r ? r.default : r
}

var curry = _interopDefault(R.curry), cond = _interopDefault(R.cond),
    isNil = _interopDefault(R.isNil), identity = _interopDefault(R.identity),
    is = _interopDefault(R.is), T = _interopDefault(R.T),
    gte = _interopDefault(R.gte), complement = _interopDefault(R.complement),
    eqProps = _interopDefault(R.eqProps), isEmpty = _interopDefault(R.isEmpty),
    anyPass = _interopDefault(R.anyPass), pipe = _interopDefault(R.pipe),
    toPairs = _interopDefault(R.toPairs), map = _interopDefault(R.map),
    adjust = _interopDefault(R.adjust), fromPairs = _interopDefault(R.fromPairs),
    range = _interopDefault(R.range), split = _interopDefault(R.split),
    path = _interopDefault(R.path), newStartsWith = _interopDefault(R.startsWith),
    newEndsWith = _interopDefault(R.endsWith), find = _interopDefault(R.find),
    propEq = _interopDefault(R.propEq), findIndex = _interopDefault(R.findIndex),
    log = function (r) {
        return console.log(r), r
    }, trace = curry(function (r, e) {
        return console.log(r), e
    }), toNumber = cond([[isNil, identity], [is(Number), identity], [T, function (r) {
        return Number(r)
    }]]), toDate = function (r) {
        return cond([[isNil, identity], [is(Object), identity], [T, function (r) {
            return new Date(r)
        }]])(r)
    }, isWithin = curry(function (r, e, t) {
        var i = is(Number);
        return i(r) && i(e) && i(t) && gte(t, r) && gte(e, t)
    }), isNotWithin = complement(isWithin), eqLength = eqProps("length"), random = function (r, e) {
        return Math.floor(Math.random() * (e - r + 1)) + r
    }, sample = function (r) {
        if (isNil(r) || isEmpty(r)) return null;
        var e = r.length - 1;
        return r[random(0, e)]
    }, isNilOrEmpty = anyPass([isNil, isEmpty]), isNotNil = complement(isNil), isUndefined = function (r) {
        return void 0 === r
    }, mapKeys = curry(function (r, e) {
        return pipe(toPairs, map(adjust(r, 0)), fromPairs)(e)
    }), rangeStep = curry(function (r, e, t) {
        return 0 === r ? null : r > 0 && t < e ? null : r < 0 && t > e ? null : map(function (t) {
            return e + r * t
        }, range(0, 1 + (t - e) / r >>> 0))
    }), dotPath = curry(function (r, e) {
        return path(split(".", r), e)
    }), startsWith = curry(function (r, e) {
        return newStartsWith(r, e)
    }), endsWith = curry(function (r, e) {
        return newEndsWith(r, e)
    }), findByProp = curry(function (r, e, t) {
        return find(propEq(r, e))(t)
    }), findIndexByProp = curry(function (r, e, t) {
        return findIndex(propEq(r, e))(t)
    }), Ramdasauce = {
        log: log,
        trace: trace,
        toNumber: toNumber,
        toDate: toDate,
        isWithin: isWithin,
        isNotWithin: isNotWithin,
        eqLength: eqLength,
        random: random,
        sample: sample,
        isNilOrEmpty: isNilOrEmpty,
        isNotNil: isNotNil,
        isUndefined: isUndefined,
        mapKeys: mapKeys,
        rangeStep: rangeStep,
        dotPath: dotPath,
        startsWith: startsWith,
        endsWith: endsWith,
        findByProp: findByProp,
        findIndexByProp: findIndexByProp
    };

