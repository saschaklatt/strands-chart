import React from "react"
import "./StrandsChart.css"
import EXAMPLE_SEQUENCES from "../data/example-sequences.json"
import { sequences2strands } from "../models/StrandModel"
import { COLORS } from "../constants"

const Strand = () => {
  return <path className="strands-chart--strand" d="M10 10 L20 20 L30 10 Z" />
}

const StrandsChart = ({ width, height, sequences = EXAMPLE_SEQUENCES }) => {
  const strands = sequences2strands(sequences)

  return (
    <svg className="strands-chart" width={width} height={height}>
      {strands.map((strand, idx) => (
        <Strand
          key={idx}
          tuples={strand}
          fill={COLORS[idx % COLORS.length]}
          curving={0.5}
        />
      ))}
    </svg>
  )
}

export default StrandsChart
