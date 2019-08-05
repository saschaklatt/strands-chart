import React from "react"
import "./StrandsChart.css"

const EXAMPLE_SEQUENCE = [
  0,
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
  0,
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

const getTupels = (sequence, width, height, direction) => {
  const domainY = [0, sequence.length - 1]
  const rangeY = [height, 0]

  const domainX = [0, Math.max(...sequence)]
  const rangeX = [0, width]

  const scaleX = makeLinearScaler(domainX, rangeX)
  const scaleY = makeLinearScaler(domainY, rangeY)

  return sequence.map((v, i) => {
    const x = scaleX(v)
    const y = scaleY(i)
    const alignedX = getAlignedX(x, width, direction)
    const p1 = [alignedX[0], y]
    const p2 = [alignedX[1], y]
    return [p1, p2]
  })
}

const tupelsToOutlineLeft = tupels => tupels.map(tupel => tupel[0])
const tupelsToOutlineRight = tupels => tupels.map(tupel => tupel[1]).reverse()

/**
 * Get first control point.
 */
const getCubicC0 = (p0, p1, curving) => [
  p0[0],
  p0[1] + (p1[1] - p0[1]) * curving,
]

/**
 * Get second control point.
 */
const getCubicC1 = (p0, p1, curving) => [
  p1[0],
  p1[1] - (p1[1] - p0[1]) * curving,
]

/**
 * Convert point array into a space-separated string.
 */
const pointToString = p => `${p[0]} ${p[1]}`

const makeCubicBezierPath = (points, curving = 1) =>
  points.reduce((path, p, idx, arr) => {
    if (idx === 0) {
      return path
    }
    const p0 = arr[idx - 1]
    const P1 = pointToString(p)
    const C0 = pointToString(getCubicC0(p0, p, curving))
    const C1 = pointToString(getCubicC1(p0, p, curving))
    return `${path} C ${C0} ${C1} ${P1}`
  }, "")

const getPath = (sequence, width, height, direction) => {
  const tupels = getTupels(sequence, width, height, direction)
  const outlineLeft = tupelsToOutlineLeft(tupels)
  const outlineRight = tupelsToOutlineRight(tupels)

  const curving = 0.5
  const p0Left = pointToString(outlineLeft[0])
  const p0Right = pointToString(outlineRight[0])
  const pathStart = `M${p0Left}`
  const pathOutlineLeft = makeCubicBezierPath(outlineLeft, curving)
  const pathEdge = `L${p0Right}`
  const pathOutlineRight = makeCubicBezierPath(outlineRight, curving)
  const pathEnd = "Z"

  return `${pathStart} ${pathOutlineLeft} ${pathEdge} ${pathOutlineRight} ${pathEnd}`
}

const StrandsChart = ({ width, height }) => (
  <svg className="strands-chart" width={width} height={height}>
    <path
      className="strands-chart--strand"
      d={getPath(EXAMPLE_SEQUENCE, 100, height, "center")}
    />
  </svg>
)

export default StrandsChart
