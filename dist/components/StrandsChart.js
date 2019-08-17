import "./StrandsChart.css";
import React from "react";
import { curveMonotoneY } from "d3-shape";
import { getBemClassName } from "../utils";
import { timeFormat } from "d3-time-format";
import { ATTR_TIME, ATTR_HEIGHT, ATTR_Y, ATTR_DATA, ATTR_KEY, ATTR_COLOR, ATTR_DIRECTION } from "../models/selectors";
import Strands from "./Strands";
import Lines from "./Lines";
import Sections from "./Sections";
import Dates from "./Dates";
export var bem = getBemClassName("strands-chart");
export var makeDateRenderer = function makeDateRenderer(format) {
  return function (_ref) {
    var time = _ref.time;
    return timeFormat(format)(time);
  };
};
export var makeSectionRenderer = function makeSectionRenderer() {
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
  }, React.createElement(Lines, props), React.createElement(Strands, props), React.createElement(Sections, props)));
};

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeDateRenderer("%Y"),
  renderSection: makeSectionRenderer()
};
export default StrandsChart;