import get from "lodash/get";
export var ATTR_COLOR = "color";
export var ATTR_DATA = "data";
export var ATTR_DIRECTION = "dir";
export var ATTR_HEIGHT = "height";
export var ATTR_KEY = "key";
export var ATTR_TIME = "time";
export var ATTR_Y = "y";
export var getColor = function getColor(d) {
  return get(d, ATTR_COLOR);
};
export var getData = function getData(d) {
  return get(d, ATTR_DATA, []);
};
export var getDirection = function getDirection(d) {
  return get(d, ATTR_DIRECTION);
};
export var getHeight = function getHeight(d) {
  return get(d, ATTR_HEIGHT);
};
export var getKey = function getKey(d) {
  return get(d, ATTR_KEY);
};
export var getTime = function getTime(d) {
  return d[ATTR_TIME];
};
export var getY = function getY(d) {
  return get(d, ATTR_Y);
};