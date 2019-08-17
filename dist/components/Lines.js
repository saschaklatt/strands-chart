import React from "react";
import { bem } from "./StrandsChart";

var Lines = function Lines(_ref) {
  var periods = _ref.periods;
  return React.createElement("div", {
    className: bem("lines")
  }, periods.map(function (_ref2) {
    var height = _ref2.height,
        key = _ref2.key;
    return React.createElement("span", {
      key: key,
      style: {
        height: "".concat(height, "px")
      }
    });
  }));
};

export default Lines;