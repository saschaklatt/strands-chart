import { area } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { isNil } from "../utils"
import { COLORS } from "../constants"

const makeBaseTuple = v => (isNil(v) ? [null, null] : [0, v])

const makeTuple = (v1, v2) => [v1, v2]

export const strandFromSequence = sequence =>
  Array.from(sequence, makeBaseTuple)

const makeTupleValueMover = dx => v => (isNil(v) ? null : v + dx)

const makeTupleValueSetter = x => v => (isNil(v) ? null : x)

const makeStrandExtender = direction => strand => sequence => {
  return strand.map((t, i) => {
    const dx = sequence[i] * direction
    const move = makeTupleValueMover(dx)
    return direction < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
  })
}

export const isNilDomain = ([p1, p2]) => isNil(p1) || isNil(p2)

export const getDomainSize = d =>
  isNilDomain(d) ? null : Math.abs(d[1] - d[0])

export const makeStrandSnuggler = dir => targetStrand => baseStrand =>
  baseStrand.map((t, i) => {
    if (isNilDomain(t) || isNilDomain(targetStrand[i])) {
      return t
    }
    const sideIdx = dir < 0 ? 0 : 1
    const x = targetStrand[i][sideIdx]
    const w = getDomainSize(t)
    const left = dir < 0 ? x - w : x
    const right = dir < 0 ? x : x + w
    const setLeft = makeTupleValueSetter(left)
    const setRight = makeTupleValueSetter(right)
    return [setLeft(t[0]), setRight(t[1])]
  })

export const getSingleSequenceWidth = sequence => Math.max(...sequence)

export const getMultiSequenceWidth = sequences => {
  const seqWidth = sequences.reduce(
    (acc, seq) => acc + getSingleSequenceWidth(seq),
    0
  )
  return seqWidth
}

const extendSequenceValue = dx => v => {
  if (isNil(dx)) {
    return v
  }
  if (isNil(v)) {
    return null
  }
  const move = makeTupleValueMover(dx)
  return move(v)
}

export const makeSequenceExtender = dx => sequence =>
  sequence.map(extendSequenceValue(dx))

const makeVerticalStrand = (x, height) =>
  Array.from({ length: height }, () => makeTuple(x, x))

export const makeInitialSilhouette = domainY =>
  makeVerticalStrand(0, getDomainSize(domainY))

const seqs2strands = (sequences, silhouette, strands = [], i = 0) => {
  if (i >= sequences.length) {
    return strands
  }

  const seq = sequences[i]
  const dir = i % 2 ? 1 : -1
  const makeDirectedSnuggler = makeStrandSnuggler(dir)
  const snuggleWithSilhouette = makeDirectedSnuggler(silhouette)

  const extendSilhouette = makeStrandExtender(dir)(silhouette)
  const newSilhouette = extendSilhouette(seq)

  const strand = snuggleWithSilhouette(strandFromSequence(seq))
    .map(attachIndex)
    .filter(withoutNullValues)
  const newStrands = [...strands, strand]

  return seqs2strands(sequences, newSilhouette, newStrands, i + 1)
}

const attachIndex = (tuple, idx) => [...tuple, idx]

const withoutNullValues = tuple => !isNilDomain(tuple)

export const sequences2strands = sequences => {
  const domainY = getSequencesDomainY(sequences)
  const silhouette = makeInitialSilhouette(domainY)
  return seqs2strands(sequences, silhouette)
}

const getLeftValues = strand => strand.map(tuple => tuple[0])

const getRightValues = strand => strand.map(tuple => tuple[1])

export const getStrandsDomainX = strands =>
  strands.reduce(
    (domain, strand) => {
      const min = Math.min(...getLeftValues(strand))
      const max = Math.max(...getRightValues(strand))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [Infinity, -Infinity]
  )

// TODO: use just one method: getSequencesDomainY() or getStrandsDomainY()
const getSequencesDomainY = sequences => [
  sequences.reduce((max, seq) => Math.max(max, seq.length), 0),
  0,
]

export const getStrandsDomainY = strands => [
  0,
  strands.reduce((max, strand) => Math.max(max, strand.length - 1), 0),
]

export const makeAreaConverter = (scaleX, scaleY, curving) => strand =>
  area()
    .curve(curving)
    .x0(d => scaleX(d[0]))
    .x1(d => scaleX(d[1]))
    .y(d => scaleY(d[2]))(strand)

export const getColorByIndex = idx => COLORS[idx % COLORS.length]

export const getStrandAreas = ({ sequences, width, height, curving }) => {
  const strands = sequences2strands(sequences)

  const rangeX = [0, width]
  const rangeY = [height, 0]
  const domainX = getStrandsDomainX(strands)
  const domainY = getStrandsDomainY(strands)

  const scaleX = scaleLinear()
    .domain(domainX)
    .range(rangeX)

  const scaleY = scaleLinear()
    .domain(domainY)
    .range(rangeY)

  return strands.map(makeAreaConverter(scaleX, scaleY, curving))
}
