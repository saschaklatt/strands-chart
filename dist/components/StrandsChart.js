import React from "react";
import { curveMonotoneY } from "d3-shape";
import { getBemClassName } from "../utils";
import { timeFormat } from "d3-time-format";
import Strands from "./Strands";
import Lines from "./Lines";
import Periods from "./Periods";
import Dates from "./Dates";
import { StrandsChartPropTypes } from "../propTypes";
export var bem = getBemClassName("strands-chart");
export var makeStandardDateRenderer = function makeStandardDateRenderer(format) {
  return function (_ref) {
    var time = _ref.time;
    return timeFormat(format)(time);
  };
};
export var makeStandardPeriodRenderer = function makeStandardPeriodRenderer() {
  return function (_ref2, idx) {
    var data = _ref2.data;
    return React.createElement(React.Fragment, null, React.createElement("strong", null, "Section ".concat(idx)), React.createElement("pre", null, JSON.stringify(data)));
  };
};

var StrandsChart = function StrandsChart(props) {
  return React.createElement("figure", {
    className: bem(),
    style: {
      height: "".concat(props.height, "px")
    }
  }, React.createElement(Dates, props), React.createElement("div", {
    className: bem("lined")
  }, React.createElement(Lines, props), React.createElement(Strands, props), React.createElement(Periods, props)));
};

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeStandardDateRenderer("%Y"),
  renderSection: makeStandardPeriodRenderer()
};
export default StrandsChart;