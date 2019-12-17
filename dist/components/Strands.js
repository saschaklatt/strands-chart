import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import "./StrandsChart.css";
import React from "react";
import noop from "lodash/noop";
import isNil from "lodash/isNil";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { transition } from "d3-transition";
import { makeMatureArea, makeDeadArea, makeNewBornArea } from "../models/areaUtils";
import { getDomainX, getDomainY } from "../models/strandUtils";
import { ATTR_DATA, getData, getColor, getKey } from "../models/selectors";
import { reverse, atLeastOneDiffers } from "../utils";
import { bem } from "./StrandsChart";
import { seqs2strands } from "../models/strandsConverter";
import { StrandsPropTypes } from "../propTypes";
var BEM_EL = "strand";
var BEM_MOD_HI = "highlight";
var BEM_MOD_LO = "lowlight";

var getClassNameHighlight = function getClassNameHighlight() {
  return bem(BEM_EL, BEM_MOD_HI);
};

var getClassNameLowlight = function getClassNameLowlight() {
  return bem(BEM_EL, BEM_MOD_LO);
};

var getNodeByIndex = function getNodeByIndex(svg, idx) {
  return svg.selectAll("path").filter(function (d, i) {
    return i === idx;
  }).node();
};

var addClass = function addClass(className) {
  return function () {
    select(this).classed(className, true);
  };
};

var removeClass = function removeClass(className) {
  return function () {
    select(this).classed(className, false);
  };
};

var Strands =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Strands, _React$Component);

  function Strands(props) {
    var _this;

    _classCallCheck(this, Strands);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Strands).call(this, props));
    _this.svg = React.createRef();
    _this.getSequences = _this.getSequences.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Strands, [{
    key: "getSequences",
    value: function getSequences() {
      return this.props.sequences;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateViz(this.props, this.svg, true);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.updateViz(nextProps, this.svg, false);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return atLeastOneDiffers(this.props, nextProps, ["width", "height"]);
    }
  }, {
    key: "updateViz",
    value: function updateViz(props, ref, isInitial) {
      var _this2 = this;

      var width = props.width,
          height = props.height,
          curving = props.curving,
          padding = props.padding,
          sequences = props.sequences,
          selectedIdx = props.selectedIdx,
          _props$onMouseEnterSt = props.onMouseEnterStrand,
          onMouseEnterStrand = _props$onMouseEnterSt === void 0 ? noop : _props$onMouseEnterSt,
          _props$onMouseLeaveSt = props.onMouseLeaveStrand,
          onMouseLeaveStrand = _props$onMouseLeaveSt === void 0 ? noop : _props$onMouseLeaveSt,
          _props$onClickStrand = props.onClickStrand,
          onClickStrand = _props$onClickStrand === void 0 ? noop : _props$onClickStrand;
      var strands = seqs2strands(sequences, ATTR_DATA);
      var strandsData = strands.map(getData);
      var scaleX = scaleLinear().domain(getDomainX(strandsData)).range([0, width]);
      var scaleY = scaleLinear().domain(getDomainY(strandsData)).range([height, 0]);
      var duration = isInitial ? 0 : 400;
      var t = transition().duration(duration);
      var tEnter = transition().duration(duration);

      if (isInitial) {
        tEnter.delay(duration / 10);
      }

      var newBornArea = makeNewBornArea(curving, scaleX, scaleY, getData);
      var matureArea = makeMatureArea(curving, scaleX, scaleY, getData);
      var deadArea = makeDeadArea(curving, scaleX, scaleY, getData);
      var svg = select(ref.current);

      var highlight = function highlight(d, i) {
        var classNameLowlight = getClassNameLowlight();
        var classNameHighlight = getClassNameHighlight();
        var others = svg.selectAll("path").filter(function (el, idx) {
          return i !== idx;
        });
        others.each(removeClass(classNameHighlight));
        others.each(addClass(classNameLowlight));
        removeClass(classNameLowlight).call(this);
        addClass(classNameHighlight).call(this);
      };

      var resetHighlight = function resetHighlight() {
        var classNameLowlight = getClassNameLowlight();
        var classNameHighlight = getClassNameHighlight();
        var all = svg.selectAll("path");
        all.each(removeClass(classNameHighlight));
        all.each(removeClass(classNameLowlight));
      };

      var handleMouseOver = function handleMouseOver(d) {
        var seqs = _this2.getSequences();

        var idx = seqs.findIndex(function (s) {
          return s.key === d.key;
        });
        onMouseEnterStrand(d, idx, _toConsumableArray(seqs));
      };

      var handleMouseOut = function handleMouseOut(d) {
        var seqs = _this2.getSequences();

        var idx = seqs.findIndex(function (s) {
          return s.key === d.key;
        });
        onMouseLeaveStrand(d, idx, _toConsumableArray(seqs));
      };

      var handleClick = function handleClick(d) {
        var seqs = _this2.getSequences();

        var idx = seqs.findIndex(function (s) {
          return s.key === d.key;
        });
        onClickStrand(d, idx, _toConsumableArray(seqs));
      };

      var data = reverse(strands);
      var paths = svg.selectAll("path").data(data, getKey);
      paths.enter().append("path").attr("class", bem("strand")).attr("fill", getColor).attr("stroke-width", 0).attr("d", newBornArea).on("click", handleClick).on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).transition(tEnter).attr("stroke-width", "".concat(padding, "px")).attr("d", matureArea).selectAll("path");
      paths.merge(paths).transition(t).attr("d", matureArea);
      paths.exit().transition(t).attr("d", deadArea).remove();
      resetHighlight();

      if (!isNil(selectedIdx)) {
        var reverseIdx = data.length - 1 - selectedIdx;
        highlight.call(getNodeByIndex(svg, reverseIdx));
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height;
      return React.createElement("div", {
        className: bem(BEM_EL)
      }, React.createElement("svg", {
        width: width,
        height: height,
        viewBox: "0 0 ".concat(width, " ").concat(height),
        preserveAspectRatio: "none",
        ref: this.svg
      }));
    }
  }]);

  return Strands;
}(React.Component);

export default Strands;