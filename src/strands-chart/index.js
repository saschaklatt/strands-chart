import React from "react"
import "./StrandsChart.css"

const EXAMPLE_SEQUENCE = [
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  2,
  2,
  2,
  2,
  0,
  0,
  1,
  1,
  2,
  4,
  5,
]

const scaleLinear = (value, domain, range) => {
  // calculate pct in original range
  const oDist = domain[1] - domain[0]
  const pct = (value - domain[0]) / oDist

  // apply pct value to target range
  const tDist = range[1] - range[0]
  return tDist * pct + range[0]
}

const makeLinearScaler = (domain, range) => value =>
  scaleLinear(value, domain, range)

const getAlignedX = (x, width, direction) => {
  switch (direction) {
    case "left":
      return [0, x]
    case "right":
      return [width - x, width]
    default:
    case "center":
      return [width / 2 - x / 2, width / 2 + x / 2]
  }
}

const getPoints = (sequence, width, height, direction) => {
  const domainY = [0, sequence.length - 1]
  const rangeY = [height, 0]

  const domainX = [0, Math.max(...sequence)]
  const rangeX = [0, width]

  const scaleX = makeLinearScaler(domainX, rangeX)
  const scaleY = makeLinearScaler(domainY, rangeY)

  const tupels = sequence.map((v, i) => {
    const x = scaleX(v)
    const y = scaleY(i)
    const alignedX = getAlignedX(x, width, direction)
    const p1 = [alignedX[0], y]
    const p2 = [alignedX[1], y]
    return [p1, p2]
  })

  const leftPoints = tupels.map(tupel => tupel[0])
  const rightPoints = tupels.map(tupel => tupel[1])
  const shape = [...leftPoints, ...rightPoints.reverse()]

  return shape.map(p => `${p[0]},${p[1]}`).join(" ")
}

const StrandsChart = ({ width, height }) => (
  <svg className="strands-chart" width={width} height={height}>
    <polygon
      className="strands-chart--strand"
      points={getPoints(EXAMPLE_SEQUENCE, 100, height, "center")}
    />
  </svg>
)

export default StrandsChart
