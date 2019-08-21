import "./StrandsChart.css"
import React from "react"
import PropTypes from "prop-types"
import { curveMonotoneY } from "d3-shape"
import { getBemClassName } from "../utils"
import { timeFormat } from "d3-time-format"
import {
  ATTR_TIME,
  ATTR_HEIGHT,
  ATTR_Y,
  ATTR_DATA,
  ATTR_KEY,
  ATTR_COLOR,
  ATTR_DIRECTION,
} from "../models/selectors"
import Strands from "./Strands"
import Lines from "./Lines"
import Sections from "./Sections"
import Dates from "./Dates"

export const bem = getBemClassName("strands-chart")

export const makeDateRenderer = format => ({ time }) => timeFormat(format)(time)

export const makeSectionRenderer = () => ({ data }, idx) => (
  <>
    <strong>{`Section ${idx}`}</strong>
    <pre>{JSON.stringify(data)}</pre>
  </>
)

const StrandsChart = props => (
  <figure className={bem()} style={{ height: `${props.height}px` }}>
    <Dates {...props} />
    <div className={bem("lined")}>
      <Lines {...props} />
      <Strands {...props} />
      <Sections {...props} />
    </div>
  </figure>
)

const NumberListPropTypes = PropTypes.arrayOf(PropTypes.number)

const SequencePropType = PropTypes.shape({
  [ATTR_KEY]: PropTypes.string.isRequired,
  [ATTR_DATA]: PropTypes.arrayOf(PropTypes.number).isRequired,
})

const StrandPropType = PropTypes.shape({
  [ATTR_KEY]: PropTypes.string.isRequired,
  [ATTR_COLOR]: PropTypes.string.isRequired,
  [ATTR_DIRECTION]: PropTypes.number.isRequired,
  [ATTR_DATA]: PropTypes.arrayOf(NumberListPropTypes).isRequired,
})

const PeriodPropType = PropTypes.shape({
  [ATTR_TIME]: PropTypes.object.isRequired,
  [ATTR_HEIGHT]: PropTypes.number.isRequired,
  [ATTR_Y]: PropTypes.number.isRequired,
  [ATTR_DATA]: PropTypes.any.isRequired,
})

StrandsChart.propTypes = {
  curving: PropTypes.func,
  padding: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sequences: PropTypes.arrayOf(SequencePropType).isRequired,
  periods: PropTypes.arrayOf(PeriodPropType).isRequired,
  renderDate: PropTypes.func.isRequired,
  renderSection: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
}

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeDateRenderer("%Y"),
  renderSection: makeSectionRenderer(),
}

export default StrandsChart
