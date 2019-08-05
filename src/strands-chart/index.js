import React from "react"
import "./StrandsChart.css"

// TODO: If null separates a sequence into two pieces, the sequence just continues instead of being separated
const EXAMPLE_SEQUENCES = [
  [null, null, 0, 1, 1, 2, 2, 2, 2, 2, 3, 3, 2, 4, 5, 0],
  [3, 4, 4, 4, 4, 2, 2, 2, 2, 0, 0, 1, 1],
  [null, null, null, 0, 2, 1, 5, 2, 0],
]

const isNil = v => v === null || v === undefined

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

const getAlignedX = (x, width, alignment) => {
  switch (alignment) {
    case "left":
      return [0, x]
    case "right":
      return [width - x, width]
    default:
    case "center":
      return [width / 2 - x / 2, width / 2 + x / 2]
  }
}

/**
 * Transform sequence values into pixel values in form of tuples.
 */
const getTuples = (sequence, width, height, alignment, offset, domainY) => {
  const rangeY = [height, 0]

  const domainX = [0, Math.max(...sequence)]
  const rangeX = [0, width]

  const scaleX = makeLinearScaler(domainX, rangeX)
  const scaleY = makeLinearScaler(domainY, rangeY)

  return sequence.reduce((tuples, v, i) => {
    if (isNil(v)) {
      return tuples
    }
    const x = scaleX(v)
    const y = scaleY(i)
    const alignedX = getAlignedX(x, width, alignment)
    const p1 = [alignedX[0] + offset, y]
    const p2 = [alignedX[1] + offset, y]
    return [...tuples, [p1, p2]]
  }, [])
}

const tuplesToOutlineLeft = tuples => tuples.map(tuple => tuple[0])
const tuplesToOutlineRight = tuples => tuples.map(tuple => tuple[1]).reverse()

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

const getPath = (sequence, width, height, align, offset, domainY, curving) => {
  const tuples = getTuples(sequence, width, height, align, offset, domainY)
  const outlineLeft = tuplesToOutlineLeft(tuples)
  const outlineRight = tuplesToOutlineRight(tuples)
  const p0Left = pointToString(outlineLeft[0])
  const p0Right = pointToString(outlineRight[0])

  const pathStart = `M${p0Left}`
  const pathOutlineLeft = makeCubicBezierPath(outlineLeft, curving)
  const pathEdge = `L${p0Right}`
  const pathOutlineRight = makeCubicBezierPath(outlineRight, curving)
  const pathEnd = "Z"

  return `${pathStart} ${pathOutlineLeft} ${pathEdge} ${pathOutlineRight} ${pathEnd}`
}

const Strand = ({
  sequence,
  width,
  height,
  align,
  offset,
  domainY,
  fill = "black",
  curving = 0.5,
}) => {
  return (
    <path
      className="strands-chart--strand"
      d={getPath(sequence, width, height, align, offset, domainY, curving)}
      fill={fill}
    />
  )
}

const getMaxSequenceLength = sequences =>
  sequences.reduce((max, seq) => Math.max(max, seq.length - 1), 0)

const StrandsChart = ({ width, height, sequences = EXAMPLE_SEQUENCES }) => {
  const domainY = [0, getMaxSequenceLength(sequences)]
  const colors = ["red", "green", "blue"]
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
