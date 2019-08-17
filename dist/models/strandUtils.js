import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import isNil from "lodash/isNil";
import { curry } from "../utils";
var getColumn = curry(function (idx, grid) {
  return grid.map(function (row) {
    return row[idx];
  });
});
var getLeftValues = getColumn(0);
var getRightValues = getColumn(1);
export var getDomainX = function getDomainX(list) {
  return list.reduce(function (domain, data) {
    var min = Math.min.apply(Math, _toConsumableArray(getLeftValues(data)));
    var max = Math.max.apply(Math, _toConsumableArray(getRightValues(data)));
    return [Math.min(domain[0], min), Math.max(domain[1], max)];
  }, [0, 0]);
};
export var getDomainY = function getDomainY(list) {
  return [0, list.reduce(function (max, arr) {
    return Math.max(max, arr.length - 1);
  }, 0)];
};
export var isNilDomain = function isNilDomain(d) {
  return isNil(d) || isNil(d[0]) || isNil(d[1]);
};
export var getDomainSize = function getDomainSize(d) {
  return isNilDomain(d) ? null : Math.abs(d[1] - d[0]);
};