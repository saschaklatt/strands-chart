import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { min, max } from "d3-array";
import { scaleTime } from "d3-scale";
import { isLast } from "../utils";
import compose from "lodash/fp/compose";
import { ATTR_TIME, ATTR_DATA, ATTR_KEY, ATTR_HEIGHT, ATTR_Y } from "./selectors";
import { getData, getTime } from "./selectors";

var nestData = function nestData(periods) {
  return periods.map(function (p) {
    return _defineProperty({}, ATTR_DATA, _objectSpread({}, p));
  });
};

var addTime = function addTime(getDate) {
  return function (periods) {
    return periods.map(function (p) {
      return _objectSpread({}, p, _defineProperty({}, ATTR_TIME, compose(getDate, getData)(p)));
    });
  };
};

var addY = function addY(scaleY) {
  return function (periods) {
    return periods.map(function (period) {
      return _objectSpread({}, period, _defineProperty({}, ATTR_Y, compose(Math.round, scaleY, getTime)(period)));
    });
  };
};

var addHeight = function addHeight(rangeY) {
  return function (periods) {
    return periods.map(function (period, idx, arr) {
      var nextY = isLast(arr, idx) ? rangeY[1] : arr[idx + 1].y;
      return _objectSpread({}, period, _defineProperty({}, ATTR_HEIGHT, Math.round(period.y - nextY)));
    });
  };
};

var addKey = function addKey(getKey) {
  return function (periods) {
    return periods.map(function (p) {
      return _objectSpread({}, p, _defineProperty({}, ATTR_KEY, getKey(getData(p))));
    });
  };
};

export var importTimePeriods = function importTimePeriods(_ref2) {
  var periods = _ref2.periods,
      height = _ref2.height,
      dateFrom = _ref2.dateFrom,
      dateTo = _ref2.dateTo,
      getKey = _ref2.getKey,
      getDate = _ref2.getDate;
  var nestedPeriods = compose(addTime(getDate), addKey(getKey), nestData)(periods);
  var domainY = [dateFrom || min(nestedPeriods, getTime), dateTo || max(nestedPeriods, getTime)];
  var rangeY = [height, 0];
  var scaleY = scaleTime().domain(domainY).range(rangeY);
  return compose(addHeight(rangeY), addY(scaleY))(nestedPeriods);
};