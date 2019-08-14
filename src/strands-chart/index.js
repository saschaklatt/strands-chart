import React from "react"
import "./StrandsChart.css"
import { getColorByIndex, getStrandAreas } from "../models/StrandModel"
import { curveMonotoneY, curveLinear } from "d3-shape"

const StrandsChart = props => (
  <svg className="strands-chart" width={props.width} height={props.height}>
    {getStrandAreas(props).map((path, idx) => (
      <path
        key={idx}
        className="strands-chart--strand"
        d={path}
        strokeWidth={`${props.padding}px`}
        fill={getColorByIndex(idx)}
      />
    ))}
  </svg>
)

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 6,
}

export default StrandsChart
