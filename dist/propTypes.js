import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _PropTypes$shape, _PropTypes$shape2, _PropTypes$shape3;

import PropTypes from "prop-types";
import { ATTR_KEY, ATTR_DATA, ATTR_COLOR, ATTR_DIRECTION, ATTR_TIME, ATTR_HEIGHT, ATTR_Y } from "./models/selectors";
export var NumberListPropTypes = PropTypes.arrayOf(PropTypes.number);
export var SequencePropType = PropTypes.shape((_PropTypes$shape = {}, _defineProperty(_PropTypes$shape, ATTR_KEY, PropTypes.string.isRequired), _defineProperty(_PropTypes$shape, ATTR_DATA, PropTypes.arrayOf(PropTypes.number).isRequired), _PropTypes$shape));
export var StrandPropType = PropTypes.shape((_PropTypes$shape2 = {}, _defineProperty(_PropTypes$shape2, ATTR_KEY, PropTypes.string.isRequired), _defineProperty(_PropTypes$shape2, ATTR_COLOR, PropTypes.string.isRequired), _defineProperty(_PropTypes$shape2, ATTR_DIRECTION, PropTypes.number.isRequired), _defineProperty(_PropTypes$shape2, ATTR_DATA, PropTypes.arrayOf(NumberListPropTypes).isRequired), _PropTypes$shape2));
export var PeriodPropType = PropTypes.shape((_PropTypes$shape3 = {}, _defineProperty(_PropTypes$shape3, ATTR_TIME, PropTypes.object.isRequired), _defineProperty(_PropTypes$shape3, ATTR_HEIGHT, PropTypes.number.isRequired), _defineProperty(_PropTypes$shape3, ATTR_Y, PropTypes.number.isRequired), _defineProperty(_PropTypes$shape3, ATTR_DATA, PropTypes.any.isRequired), _PropTypes$shape3));
var periodsPropType = PropTypes.arrayOf(PeriodPropType);
var sequencesPropType = PropTypes.arrayOf(SequencePropType);
var renderPeriodPropType = PropTypes.func;
var renderDatePropType = PropTypes.func;
var curvingPropType = PropTypes.func;
var heightPropType = PropTypes.number;
var widthPropType = PropTypes.number;
var paddingPropType = PropTypes.number;
var onMouseEnterPropType = PropTypes.func;
var onMouseLeavePropType = PropTypes.func;
var onMouseMovePropType = PropTypes.func;
var onClickPropType = PropTypes.func;
export var PeriodsPropTypes = {
  periods: periodsPropType.isRequired,
  renderPeriod: renderPeriodPropType.isRequired
};
export var LinesPropTypes = {
  periods: periodsPropType.isRequired,
  renderPeriod: renderPeriodPropType.isRequired
};
export var DatesPropTypes = {
  periods: periodsPropType.isRequired,
  renderDate: renderDatePropType.isRequired
};
export var StrandsPropTypes = {
  curving: curvingPropType.isRequired,
  padding: paddingPropType.isRequired,
  width: widthPropType.isRequired,
  height: heightPropType.isRequired,
  sequences: sequencesPropType.isRequired,
  onMouseEnterStrand: onMouseEnterPropType,
  onMouseLeaveStrand: onMouseLeavePropType,
  onClickStrand: onClickPropType
};
export var StrandsChartPropTypes = {
  curving: curvingPropType,
  padding: paddingPropType,
  width: widthPropType.isRequired,
  height: heightPropType.isRequired,
  onMouseEnterStrand: onMouseEnterPropType,
  onMouseLeaveStrand: onMouseLeavePropType,
  onMouseMove: onMouseMovePropType,
  onClickStrand: onClickPropType,
  periods: periodsPropType.isRequired,
  renderDate: renderDatePropType,
  renderPeriod: renderPeriodPropType,
  selectedIdx: PropTypes.number,
  sequences: sequencesPropType.isRequired
};