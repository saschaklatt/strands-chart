import React from "react"
import "./StrandsChart.css"
import EXAMPLE_SEQUENCES from "../data/example-sequences.json"
import { getMaxSequenceLength } from "../utils.js"

const Strand = ({ sequence }) => {
  const d = sequence.map(v => {})
  return <path className="strands-chart--strand" d="M10 10 L20 20 L30 10 Z" />
}

const StrandsChart = ({ width, height, sequences = EXAMPLE_SEQUENCES }) => {
  const domainY = [0, getMaxSequenceLength(sequences)]
  const colors = ["red", "green", "blue", "orange"]
  const padding = 20
  const strandWidth = 100
  return (
    <svg className="strands-chart" width={width} height={height}>
      {sequences.map((sequence, idx) => (
        <Strand
          key={idx}
          domainY={domainY}
          sequence={sequence}
          offset={idx * (strandWidth + padding)}
          width={strandWidth}
          height={height}
          align="center"
          fill={colors[idx % colors.length]}
          curving={0.5}
        />
      ))}
    </svg>
  )
}

export default StrandsChart
