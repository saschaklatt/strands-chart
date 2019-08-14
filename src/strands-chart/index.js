import React from "react"
import PropTypes from "prop-types"
import "./StrandsChart.css"
import { getColorByIndex, getStrandAreas } from "../models/StrandModel"
import { curveMonotoneY, curveLinear } from "d3-shape"
import { getBemClassName } from "../utils"

const bem = getBemClassName("strands-chart")

const Dates = ({ periods }) => (
  <div className={bem("dates")}>
    {periods.map(({ year, flexYear, position }) => (
      <span key={position} style={{ height: `${flexYear}px` }}>
        {year}
      </span>
    ))}
  </div>
)

const Positions = ({ periods }) => (
  <div className={bem("positions")}>
    {periods.map(({ flexYear, position, organisation }) => (
      <div key={position} style={{ height: `${flexYear}px` }}>
        <div>
          <span>{position}</span>
          <span>{`@ ${organisation}`}</span>
        </div>
      </div>
    ))}
  </div>
)

const Lines = ({ periods }) => (
  <div className={bem("lines")}>
    {periods.map(({ flexYear, position }) => (
      <span key={position} style={{ height: `${flexYear}px` }} />
    ))}
  </div>
)

const Strands = props => (
  <g className={bem("strands")}>
    {getStrandAreas(props).map((path, idx) => (
      <path
        key={idx}
        className={bem("strand")}
        d={path}
        strokeWidth={`${props.padding}px`}
        fill={getColorByIndex(idx)}
      />
    ))}
  </g>
)

const StrandsChart = props => (
  <div className={bem()} style={{ height: `${props.height}px` }}>
    <Dates {...props} />
    <div className={bem("lined")}>
      <Lines {...props} />
      <svg width={props.width} height={props.height}>
        <Strands {...props} />
      </svg>
      <Positions {...props} />
    </div>
  </div>
)

const SequencePropType = PropTypes.arrayOf(PropTypes.number)

StrandsChart.propTypes = {
  curving: PropTypes.func,
  padding: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sequences: PropTypes.arrayOf(SequencePropType).isRequired,
}

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 6,
}

export default StrandsChart
