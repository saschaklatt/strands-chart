export var ATTR_TIME = "time";
export var ATTR_HEIGHT = "height";
export var ATTR_Y = "y";
export var ATTR_DATA = "data";
export var ATTR_KEY = "key";
export var ATTR_COLOR = "color";
export var ATTR_DIRECTION = "dir";
export var getTime = function getTime(d) {
  return d[ATTR_TIME];
};
export var getData = function getData(d) {
  return d && d[ATTR_DATA] ? d[ATTR_DATA] : [];
};