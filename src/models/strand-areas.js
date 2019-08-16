/**
 * @fileoverview Converts sequences into svg area paths.
 */

import { area } from "d3-shape"
import {
  isNil,
  isNilDomain,
  getDomainSize,
  inject,
  curry,
  increase,
  getCenter,
} from "../utils"
import compose from "lodash/fp/compose"

const extract = key => list => list.map(data => data && data[key])

export const getDomainX = list =>
  list.reduce(
    (domain, data) => {
      const min = Math.min(...getLeftValues(data))
      const max = Math.max(...getRightValues(data))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [Infinity, -Infinity]
  )

export const getDomainY = list => [
  0,
  list.reduce((max, arr) => Math.max(max, arr.length - 1), 0),
]

const makeInitialPair = v => (isNil(v) ? [null, null] : [0, v])

const strandFromSequence = seq => Array.from(seq, makeInitialPair)

const moveValue = dx => v => (isNil(v) ? null : v + dx)

const setValue = x => v => (isNil(v) ? null : x)

const extendSilhouette = dir => sil => seq =>
  sil.map((t, i) => {
    const dx = seq[i] * dir
    const move = moveValue(dx)
    return dir < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
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

const makeSilhouette = dataKey =>
  compose(
    makeInitialSilhouette,
    increase,
    getDomainSize,
    getDomainY,
    extract(dataKey)
  )

export const seqs2strands = (
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
  const snuggleWithSilhouette = snuggle(seq.dir)(silhouette)
  const newSilhouette = extendSilhouette(seq.dir)(silhouette)(seqData)

  const makeStrand = compose(
    removeNullValues,
    attachIndex,
    snuggleWithSilhouette,
    strandFromSequence
  )
  const newStrands = [...strands, inject(seq, dataKey, makeStrand(seqData))]

  return seqs2strands(sequences, dataKey, newSilhouette, newStrands, i + 1)
}

const attachIndex = strand => strand.map((pair, idx) => [...pair, idx])

const removeNullValues = strand => strand.filter(pair => !isNilDomain(pair))

const getLeftValues = data => data.map(pair => pair[0])

const getRightValues = data => data.map(pair => pair[1])

// export const makeBornArea = curry(
//   (curving, scaleX, scaleY, getData, strands, strand, idx) => {
//     const prev = idx > 0 ? strands[idx - 1] : strand.data.map(d => [0, 0])
//     // console.log("idx", idx, prev)
//     return area()
//       .curve(curving)
//       .x0((d, i) => {
//         console.log(prev[i])
//         return scaleX(prev[i][strand.dir > 0 ? 0 : 1])
//       })
//       .x1((d, i) => scaleX(prev[i][strand.dir > 0 ? 0 : 1]))
//       .y(d => scaleY(d[2]))(getData(strand))
//   }
// )

export const makeBornArea = curry((curving, scaleX, scaleY, getData, strand) =>
  area()
    .curve(curving)
    .x0(d => scaleX(getCenter(d)))
    .x1(d => scaleX(getCenter(d)))
    .y(d => scaleY(d[2]))(getData(strand))
)

export const makeDiedArea = curry((curving, scaleX, scaleY, getData, strand) =>
  area()
    .curve(curving)
    .x0(d => scaleX(d[strand.dir > 0 ? 0 : 1]))
    .x1(d => scaleX(d[strand.dir > 0 ? 0 : 1]))
    .y(d => scaleY(d[2]))(getData(strand))
)

export const makeMatureArea = curry(
  (curving, scaleX, scaleY, getData, strand) =>
    area()
      .curve(curving)
      .x0(d => scaleX(d[0]))
      .x1(d => scaleX(d[1]))
      .y(d => scaleY(d[2]))(getData(strand))
)
