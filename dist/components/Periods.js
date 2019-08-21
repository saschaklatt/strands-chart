import React from "react";
import { bem } from "./StrandsChart";
import { PeriodsPropTypes } from "../propTypes";

var Periods = function Periods(_ref) {
  var periods = _ref.periods,
      renderPeriod = _ref.renderPeriod;
  return React.createElement("div", {
    className: bem("periods")
  }, periods.map(function (period, idx) {
    return React.createElement("div", {
      key: period.key,
      style: {
        flex: "1 1 ".concat(period.height, "px")
      }
    }, React.createElement("div", null, renderPeriod(period, idx)));
  }));
};

export default Periods;