/**
 * @fileoverview Converts sequences into strands.
 */

import isNil from "lodash/isNil"
import { inject, increase } from "../utils"
import compose from "lodash/fp/compose"
import { getDomainY, isNilDomain, getDomainSize } from "./strandUtils"

const extract = key => list => list.map(data => data && data[key])

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

const attachIndex = strand => strand.map((pair, idx) => [...pair, idx])

const removeNullValues = strand => strand.filter(pair => !isNilDomain(pair))

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
