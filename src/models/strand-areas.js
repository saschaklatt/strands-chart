/**
 * @fileoverview Converts sequences into svg area paths.
 */

import { area } from "d3-shape"
import { scaleLinear } from "d3-scale"
import {
  isNil,
  reverse,
  isNilDomain,
  getDomainSize,
  add,
  inject,
  curry,
} from "../utils"
import { COLORS } from "../constants"
import compose from "lodash/fp/compose"

const extract = key => list => list.map(data => data && data[key])

const getDomainX = list =>
  list.reduce(
    (domain, data) => {
      const min = Math.min(...getLeftValues(data))
      const max = Math.max(...getRightValues(data))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [Infinity, -Infinity]
  )

const getDomainY = list => [
  0,
  list.reduce((max, arr) => Math.max(max, arr.length - 1), 0),
]

const makeInitialPair = v => (isNil(v) ? [null, null] : [0, v])

const strandFromSequence = seq => Array.from(seq, makeInitialPair)

const moveValue = dx => v => (isNil(v) ? null : v + dx)

const setValue = x => v => (isNil(v) ? null : x)

const extendSilhouette = dir => sil => seq => {
  return sil.map((t, i) => {
    const dx = seq[i] * dir
    const move = moveValue(dx)
    return dir < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
  })
}

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

const makeSilhouette = dataKey =>
  compose(
    makeInitialSilhouette,
    add(1), // why add one?
    getDomainSize,
    getDomainY,
    extract(dataKey)
  )

const seqs2strands = (
  sequences,
  dataKey,
  silhouette = makeSilhouette(dataKey)(sequences),
  strands = [],
  i = 0
) => {
  if (i >= sequences.length) {
    return strands
  }

  const seq = sequences[i]
  const seqData = seq[dataKey]
  const dir = i % 2 ? 1 : -1
  const snuggleWithSilhouette = snuggle(dir)(silhouette)
  const newSilhouette = extendSilhouette(dir)(silhouette)(seqData)

  const makeStrand = compose(
    removeNullValues,
    attachIndex,
    snuggleWithSilhouette,
    strandFromSequence
  )
  const newStrands = [...strands, inject(seq)(dataKey)(makeStrand(seqData))]

  return seqs2strands(sequences, dataKey, newSilhouette, newStrands, i + 1)
}

const attachIndex = strand => strand.map((pair, idx) => [...pair, idx])

const removeNullValues = strand => strand.filter(pair => !isNilDomain(pair))

const getLeftValues = data => data.map(pair => pair[0])

const getRightValues = data => data.map(pair => pair[1])

const toArea = curry((scaleX, scaleY, curving, dataKey, strands) =>
  strands.map(strand =>
    inject(strand)(dataKey)(
      area()
        .curve(curving)
        .x0(d => scaleX(d[0]))
        .x1(d => scaleX(d[1]))
        .y(d => scaleY(d[2]))(strand[dataKey])
    )
  )
)

export const areas = curry((width, height, curving, dataKey, sequences) => {
  const strands = seqs2strands(sequences, dataKey)
  const strandsData = strands.map(s => s[dataKey])

  const scaleX = scaleLinear()
    .domain(getDomainX(strandsData))
    .range([0, width])

  const scaleY = scaleLinear()
    .domain(getDomainY(strandsData))
    .range([height, 0])

  return compose(
    reverse,
    toArea(scaleX, scaleY, curving, dataKey)
  )(strands)
})

export const getColorByIndex = idx => COLORS[idx % COLORS.length]
