import React from "react"
import "./StrandsChart.css"
import EXAMPLE_SEQUENCES from "../data/example-sequences.json"
import {
  sequences2strands,
  makePixelConverter,
  getPolygonPath,
} from "../models/StrandModel"
import { COLORS } from "../constants"

const Strand = ({ path, fill }) => {
  return <path className="strands-chart--strand" d={path} fill={fill} />
}

const StrandsChart = ({ width, height, sequences = EXAMPLE_SEQUENCES }) => {
  const rangeX = [0, width]
  const rangeY = [height, 0]
  const getPixelValues = makePixelConverter(rangeX, rangeY)
  const strands = sequences2strands(sequences, 0.2)
  const paths = getPixelValues(strands).map(getPolygonPath)
  return (
    <svg className="strands-chart" width={width} height={height}>
      {paths.map((path, idx) => (
        <Strand
          key={idx}
          path={path}
          fill={COLORS[idx % COLORS.length]}
          curving={0.5}
        />
      ))}
    </svg>
  )
}

export default StrandsChart
