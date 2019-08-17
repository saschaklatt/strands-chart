import React from "react";
import { bem } from "./StrandsChart";

var Sections = function Sections(_ref) {
  var periods = _ref.periods,
      renderSection = _ref.renderSection;
  return React.createElement("div", {
    className: bem("sections")
  }, periods.map(function (period, idx) {
    return React.createElement("div", {
      key: period.key,
      style: {
        flex: "1 1 ".concat(period.height, "px")
      }
    }, React.createElement("div", null, renderSection(period, idx)));
  }));
};

export default Sections;