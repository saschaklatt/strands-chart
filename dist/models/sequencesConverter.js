import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import isNil from "lodash/isNil";
import compose from "lodash/fp/compose";
import { ATTR_COLOR, ATTR_DIRECTION } from "./selectors";
/**
 * Converts the base format grouped by years into strands grouped by data items.
 *
 * Algorithm:
 * - sort raw data by year
 * - make a sequence array for each language
 * - replace null-values in the middle with 0-values
 * - sort strands by surface area
 *
 * Base format:
 * [
 *   {
 *     "year": 2005,
 *     "data": {
 *       "js": 1,
 *       "php": 2,
 *       "cpp": 1,
 *       "vba": 2,
 *       "mysql": 2
 *     }
 *   },
 *   ...
 * ]
 *
 * Target format:
 * [
 *   {
 *     key: "js",
 *     data: [0, 1, 2, 2, 3, 1, 0, 0, 0, 1, 0],
 *   },
 *   {
 *     key: "php",
 *     data: [0, 1, 2, 3, 3, 4, 4, 3, 0, 1, 0],
 *   },
 *   ...
 * ]
 */

var getYear = function getYear(d) {
  return d && d.year ? d.year : null;
};

var getData = function getData(d) {
  return d && d.data ? d.data : [];
};

var makeValueSelector = function makeValueSelector(d) {
  return function (value) {
    return getData(d)[value] || 0;
  };
};

var asc = function asc(selector) {
  return function (a, b) {
    return selector(a) - selector(b);
  };
};

var uniqueList = function uniqueList(list, key) {
  return list.includes(key) ? _toConsumableArray(list) : [].concat(_toConsumableArray(list), [key]);
};

var filterKeys = function filterKeys(selector) {
  return function (arr) {
    return arr.reduce(function (list, entry) {
      return Object.keys(selector(entry)).reduce(uniqueList, list);
    }, []);
  };
};

var keysToObject = function keysToObject(keys) {
  return keys.reduce(function (acc, key) {
    return _objectSpread({}, acc, _defineProperty({}, key, []));
  }, {});
};

var toArray = function toArray(obj) {
  return Object.entries(obj).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        data = _ref2[1];

    return {
      key: key,
      data: data
    };
  });
};

var putValuesIntoList = function putValuesIntoList(keys) {
  return function (acc, d) {
    var getValue = makeValueSelector(d);
    keys.forEach(function (key) {
      return acc[key].push(getValue(key));
    }); // FIXME: push() is IMPURE!

    return acc;
  };
};

var nil2zero = function nil2zero(v) {
  return isNil(v) || isNaN(v) ? 0 : v;
};

var sum = function sum(a, b) {
  return nil2zero(a) + nil2zero(b);
};

var getSurfaceArea = function getSurfaceArea(strand) {
  return strand.reduce(sum, 0);
};

var descSurfaceArea = function descSurfaceArea(selector) {
  return function (a, b) {
    return getSurfaceArea(selector(b)) - getSurfaceArea(selector(a));
  };
};

var sortByYear = function sortByYear(input) {
  return _toConsumableArray(input).sort(asc(getYear));
};

var toKeyListObject = function toKeyListObject(keys) {
  return function (arr) {
    return arr.reduce(putValuesIntoList(keys), keysToObject(keys));
  };
};

var sortBySurfaceArea = function sortBySurfaceArea(arr) {
  return arr.sort(descSurfaceArea(getData));
};

var addColors = function addColors(colors) {
  return function (arr) {
    return arr.map(function (v, idx) {
      return _objectSpread({}, v, _defineProperty({}, ATTR_COLOR, colors[idx % colors.length]));
    });
  };
};

var addDirection = function addDirection(arr) {
  return arr.map(function (d, i) {
    return _objectSpread({}, d, _defineProperty({}, ATTR_DIRECTION, i % 2 ? 1 : -1));
  });
};

export var importSequences = function importSequences(input, colors) {
  var sorted = sortByYear(input);
  var keys = filterKeys(getData)(sorted);
  return compose(addDirection, addColors(colors), sortBySurfaceArea, toArray, toKeyListObject(keys))(sorted);
};