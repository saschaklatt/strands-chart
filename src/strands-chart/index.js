import React from "react"
import "./StrandsChart.css"
import EXAMPLE_SEQUENCES from "../data/example-sequences.json"
import { getColorByIndex, getStrandAreas } from "../models/StrandModel"
import { curveMonotoneY } from "d3-shape"

const Strand = ({ path, fill }) => (
  <path className="strands-chart--strand" d={path} fill={fill} />
)

const StrandsChart = props => (
  <svg className="strands-chart" width={props.width} height={props.height}>
    {getStrandAreas(props).map((path, idx) => (
      <Strand key={idx} path={path} fill={getColorByIndex(idx)} />
    ))}
  </svg>
)

StrandsChart.defaultProps = {
  sequences: EXAMPLE_SEQUENCES,
  padding: 0.2,
  curving: curveMonotoneY,
}

export default StrandsChart
