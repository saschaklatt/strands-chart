import "./StrandsChart.css"
import React from "react"
import PropTypes from "prop-types"
import { getColorByIndex, areas } from "../models/strand-areas"
import { curveMonotoneY } from "d3-shape"
import { getBemClassName } from "../utils"
import { timeFormat } from "d3-time-format"
import {
  ATTR_TIME,
  ATTR_HEIGHT,
  ATTR_Y,
  ATTR_DATA,
} from "../models/time-periods"

const bem = getBemClassName("strands-chart")

export const makeDateRenderer = format => ({ time }) => timeFormat(format)(time)

export const makeSectionRenderer = () => (period, idx) => (
  <>{`Section ${idx}`}</>
)

const Dates = ({ periods, renderDate }) => (
  <div className={bem("dates")}>
    {periods.map((period, idx) => (
      <span key={period.key} style={{ height: `${period.height}px` }}>
        {renderDate(period, idx)}
      </span>
    ))}
  </div>
)

const Sections = ({ periods, renderSection }) => (
  <div className={bem("sections")}>
    {periods.map((period, idx) => (
      <div key={period.key} style={{ flex: `1 1 ${period.height}px` }}>
        <div>{renderSection(period, idx)}</div>
      </div>
    ))}
  </div>
)

const Lines = ({ periods }) => (
  <div className={bem("lines")}>
    {periods.map(({ height, key }) => (
      <span key={key} style={{ height: `${height}px` }} />
    ))}
  </div>
)

const Strands = ({ width, height, curving, padding, sequences }) => (
  <div className={bem("strands")}>
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {areas(width, height, curving, ATTR_DATA, sequences).map((area, idx) => (
        <path
          key={idx}
          className={bem("strand")}
          d={area[ATTR_DATA]}
          strokeWidth={`${padding}px`}
          fill={getColorByIndex(idx)}
        />
      ))}
    </svg>
  </div>
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

const SequencePropType = PropTypes.arrayOf(PropTypes.number)

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
}

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeDateRenderer("%Y"),
  renderSection: makeSectionRenderer(),
}

export default StrandsChart
