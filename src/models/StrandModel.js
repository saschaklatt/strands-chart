/**
 * @fileoverview Converts sequences into svg area paths.
 */

import { area } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { isNil, reverse, isNilDomain, getDomainSize, add } from "../utils"
import { COLORS } from "../constants"
import compose from "lodash/fp/compose"

const getDomainY = list => [
  0,
  list.reduce((max, arr) => Math.max(max, arr.length - 1), 0),
]

const makeInitialPair = v => (isNil(v) ? [null, null] : [0, v])

const strandFromSequence = sequence => Array.from(sequence, makeInitialPair)

const moveValue = dx => v => (isNil(v) ? null : v + dx)

const setValue = x => v => (isNil(v) ? null : x)

const extendStrand = direction => strand => sequence =>
  strand.map((t, i) => {
    const dx = sequence[i] * direction
    const move = moveValue(dx)
    return direction < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
  })

const snuggle = dir => targetStrand => baseStrand =>
  baseStrand.map((pair, i) => {
    if (isNilDomain(pair) || isNilDomain(targetStrand[i])) {
      return pair
    }
    const side = dir < 0 ? 0 : 1
    const x = targetStrand[i][side]
    const w = getDomainSize(pair)
    const setLeft = setValue(dir < 0 ? x - w : x)
    const setRight = setValue(dir < 0 ? x : x + w)
    return [setLeft(pair[0]), setRight(pair[1])]
  })

const makeVerticalStrand = (x, height) =>
  Array.from({ length: height }, () => [x, x])

const makeInitialSilhouette = height => makeVerticalStrand(0, height)

const makeSilhouette = compose(
  makeInitialSilhouette,
  add(1), // why add one?
  getDomainSize,
  getDomainY
)

const seqs2strands = (
  sequences,
  silhouette = makeSilhouette(sequences),
  strands = [],
  i = 0
) => {
  if (i >= sequences.length) {
    return strands
  }

  const seq = sequences[i]
  const dir = i % 2 ? 1 : -1
  const snuggleWithSilhouette = snuggle(dir)(silhouette)
  const newSilhouette = extendStrand(dir)(silhouette)(seq)

  const makeStrand = compose(
    removeNullValues,
    attachIndex,
    snuggleWithSilhouette,
    strandFromSequence
  )
  const newStrands = [...strands, makeStrand(seq)]

  return seqs2strands(sequences, newSilhouette, newStrands, i + 1)
}

const attachIndex = strands => strands.map((pair, idx) => [...pair, idx])

const removeNullValues = strands => strands.filter(pair => !isNilDomain(pair))

const getLeftValues = strand => strand.map(pair => pair[0])

const getRightValues = strand => strand.map(pair => pair[1])

const getStrandsDomainX = strands =>
  strands.reduce(
    (domain, strand) => {
      const min = Math.min(...getLeftValues(strand))
      const max = Math.max(...getRightValues(strand))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [Infinity, -Infinity]
  )

const toArea = ({ scaleX, scaleY, curving }) => strands =>
  strands.map(strand =>
    area()
      .curve(curving)
      .x0(d => scaleX(d[0]))
      .x1(d => scaleX(d[1]))
      .y(d => scaleY(d[2]))(strand)
  )

export const areas = ({ width, height, curving }) => sequences => {
  const strands = seqs2strands(sequences)

  const scaleX = scaleLinear()
    .domain(getStrandsDomainX(strands))
    .range([0, width])

  const scaleY = scaleLinear()
    .domain(getDomainY(strands))
    .range([height, 0])

  return compose(
    reverse,
    toArea({ scaleX, scaleY, curving })
  )(strands)
}

export const getColorByIndex = idx => COLORS[idx % COLORS.length]
