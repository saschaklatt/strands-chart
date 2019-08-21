import PropTypes from "prop-types"
import {
  ATTR_KEY,
  ATTR_DATA,
  ATTR_COLOR,
  ATTR_DIRECTION,
  ATTR_TIME,
  ATTR_HEIGHT,
  ATTR_Y,
} from "./models/selectors"

export const NumberListPropTypes = PropTypes.arrayOf(PropTypes.number)

export const SequencePropType = PropTypes.shape({
  [ATTR_KEY]: PropTypes.string.isRequired,
  [ATTR_DATA]: PropTypes.arrayOf(PropTypes.number).isRequired,
})

export const StrandPropType = PropTypes.shape({
  [ATTR_KEY]: PropTypes.string.isRequired,
  [ATTR_COLOR]: PropTypes.string.isRequired,
  [ATTR_DIRECTION]: PropTypes.number.isRequired,
  [ATTR_DATA]: PropTypes.arrayOf(NumberListPropTypes).isRequired,
})

export const PeriodPropType = PropTypes.shape({
  [ATTR_TIME]: PropTypes.object.isRequired,
  [ATTR_HEIGHT]: PropTypes.number.isRequired,
  [ATTR_Y]: PropTypes.number.isRequired,
  [ATTR_DATA]: PropTypes.any.isRequired,
})

const periodsPropType = PropTypes.arrayOf(PeriodPropType)

const sequencesPropType = PropTypes.arrayOf(SequencePropType)

const renderPeriodPropType = PropTypes.func

const renderDatePropType = PropTypes.func

const curvingPropType = PropTypes.func

const heightPropType = PropTypes.number

const widthPropType = PropTypes.number

const paddingPropType = PropTypes.number

export const PeriodsPropTypes = {
  periods: periodsPropType.isRequired,
  renderPeriod: renderPeriodPropType.isRequired,
}

export const LinesPropTypes = {
  periods: periodsPropType.isRequired,
  renderPeriod: renderPeriodPropType.isRequired,
}

export const DatesPropTypes = {
  periods: periodsPropType.isRequired,
  renderDate: renderDatePropType.isRequired,
}

export const StrandsPropTypes = {
  curving: curvingPropType.isRequired,
  padding: paddingPropType.isRequired,
  width: widthPropType.isRequired,
  height: heightPropType.isRequired,
  sequences: sequencesPropType.isRequired,
}

export const StrandsChartPropTypes = {
  curving: curvingPropType,
  padding: paddingPropType,
  width: widthPropType.isRequired,
  height: heightPropType.isRequired,
  sequences: sequencesPropType.isRequired,
  periods: periodsPropType.isRequired,
  renderDate: renderDatePropType,
  renderPeriod: renderPeriodPropType,
}
