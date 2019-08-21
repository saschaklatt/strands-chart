import "./StrandsChart.css"
import React from "react"
import { curveMonotoneY } from "d3-shape"
import { getBemClassName } from "../utils"
import { timeFormat } from "d3-time-format"
import Strands from "./Strands"
import Lines from "./Lines"
import Periods from "./Periods"
import Dates from "./Dates"
import { StrandsChartPropTypes } from "../propTypes"

export const bem = getBemClassName("strands-chart")

export const makeStandardDateRenderer = format => ({ time }) =>
  timeFormat(format)(time)

export const makeStandardPeriodRenderer = () => ({ data }, idx) => (
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
      <Periods {...props} />
    </div>
  </figure>
)

StrandsChart.propTypes = StrandsChartPropTypes

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeStandardDateRenderer("%Y"),
  renderSection: makeStandardPeriodRenderer(),
}

export default StrandsChart
