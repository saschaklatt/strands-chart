/**
 * @fileoverview Converts strands into svg area paths.
 */
import { area } from "d3-shape";
import { curry, getCenter } from "../utils";
export var makeNewBornArea = curry(function (curving, scaleX, scaleY, getData, strand) {
  return area().curve(curving).x0(function (d) {
    return scaleX(getCenter(d));
  }).x1(function (d) {
    return scaleX(getCenter(d));
  }).y(function (d) {
    return scaleY(d[2]);
  })(getData(strand));
});
export var makeDeadArea = curry(function (curving, scaleX, scaleY, getData, strand) {
  return area().curve(curving).x0(function (d) {
    return scaleX(d[strand.dir > 0 ? 0 : 1]);
  }).x1(function (d) {
    return scaleX(d[strand.dir > 0 ? 0 : 1]);
  }).y(function (d) {
    return scaleY(d[2]);
  })(getData(strand));
});
export var makeMatureArea = curry(function (curving, scaleX, scaleY, getData, strand) {
  return area().curve(curving).x0(function (d) {
    return scaleX(d[0]);
  }).x1(function (d) {
    return scaleX(d[1]);
  }).y(function (d) {
    return scaleY(d[2]);
  })(getData(strand));
});