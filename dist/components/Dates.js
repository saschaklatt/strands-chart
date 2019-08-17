import React from "react";
import { bem } from "./StrandsChart";

var Dates = function Dates(_ref) {
  var periods = _ref.periods,
      renderDate = _ref.renderDate;
  return React.createElement("div", {
    className: bem("dates")
  }, periods.map(function (period, idx) {
    return React.createElement("span", {
      key: period.key,
      style: {
        height: "".concat(period.height, "px")
      }
    }, renderDate(period, idx));
  }));
};

export default Dates;