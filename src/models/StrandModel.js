import { isNil, getHalf } from "../utils"

const makeBaseTuple = v => (isNil(v) ? [null, null] : [0, v])

const makeTuple = (v1, v2) => [v1, v2]

export const strandFromSequence = sequence =>
  Array.from(sequence, makeBaseTuple)

const makeTupleValueMover = dx => v => (isNil(v) ? null : v + dx)

const makeTupleValueSetter = x => v => (isNil(v) ? null : x)

const moveTuple = dx => t => {
  if (isNil(dx)) {
    return t
  }
  const move = makeTupleValueMover(dx)
  return t.map(move)
}

export const moveStrand = (strand, dx) => strand.map(moveTuple(dx))

const makeStrandMover = dx => strand => strand.map(moveTuple(dx))

const makeStrandExtender = direction => strand => sequence => {
  return strand.map((t, i) => {
    const dx = sequence[i] * direction
    const move = makeTupleValueMover(dx)
    return direction < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
  })
}

export const makeLeftExtender = makeStrandExtender(-1)

export const makeRightExtender = makeStrandExtender(1)

const isNilDomain = ([p1, p2]) => isNil(p1) || isNil(p2)

export const getDomainWidth = d =>
  isNilDomain(d) ? null : Math.abs(d[1] - d[0])

export const getDomainCenter = d =>
  isNilDomain(d) ? null : d[0] + (d[1] - d[0]) / 2

const makeStrandSnuggler = dir => (targetStrand, pad = 0) => baseStrand => {
  return baseStrand.map((t, i) => {
    if (isNilDomain(t) || isNilDomain(targetStrand[i])) {
      return t
    }
    const sideIdx = dir < 0 ? 0 : 1
    const x = targetStrand[i][sideIdx] + pad * dir
    const w = getDomainWidth(t)
    const left = dir < 0 ? x - w : x
    const right = dir < 0 ? x : x + w
    const setLeft = makeTupleValueSetter(left)
    const setRight = makeTupleValueSetter(right)
    return [setLeft(t[0]), setRight(t[1])]
  })
}

export const makeLeftSnuggler = makeStrandSnuggler(-1)

export const makeRightSnuggler = makeStrandSnuggler(1)

export const getSingleSequenceWidth = sequence => Math.max(...sequence)

export const getMultiSequenceWidth = (sequences, padding = 0) => {
  const seqWidth = sequences.reduce(
    (acc, seq) => acc + getSingleSequenceWidth(seq),
    0
  )
  const padWidth = padding * (sequences.length - 1)
  return seqWidth + padWidth
}

export const getSequencesDomainX = (sequences, padding = 0) => {
  const width = getMultiSequenceWidth(sequences, padding)
  return [0, width]
}

export const getSequencesDomainY = sequences => {
  const maxLength = sequences.reduce((max, seq) => {
    const v = seq.length
    return v > max ? v : max
  }, 0)
  return [maxLength, 0]
}

const extendSequenceValue = dx => v => {
  if (isNil(dx)) {
    return v
  }
  if (isNil(v)) {
    return null
  }
  return v + dx
}

export const makeSequenceExtender = dx => sequence =>
  sequence.map(extendSequenceValue(dx))

const makeVerticalStrand = (x, height) =>
  Array.from({ length: height }, () => makeTuple(x, x))

export const makeEmptySilhouette = domainY => {
  const maxY = getDomainWidth(domainY)
  return makeVerticalStrand(0, maxY)
}

const strand2seq = strand => strand.map(getDomainWidth)

const getHalfStrandWidth = strand => {
  return getHalf(getSingleSequenceWidth(strand2seq(strand)))
}

const seqs2strands = (sequences, silhouette, pad, strands = [], i = 0) => {
  if (i >= sequences.length) {
    // // move strands to the center
    // // TODO: use a compose function
    // const move = makeStrandMover(getHalfStrandWidth(strand2sequence(silhouette)))
    // return strands.map(move)

    return strands
  }

  const seq = sequences[i]
  const dir = i % 2 ? 1 : -1
  const makeDirectedSnuggler = makeStrandSnuggler(dir)
  const padNoFirst = i === 0 ? 0 : pad
  const snuggleWithSilhouette = makeDirectedSnuggler(silhouette, padNoFirst)
  const strand = snuggleWithSilhouette(strandFromSequence(seq))

  const extendSilhouette = makeStrandExtender(dir)(silhouette)
  const newSilhouette = extendSilhouette(seq)

  const newStrands = [...strands, strand]
  return seqs2strands(sequences, newSilhouette, pad, newStrands, i + 1)
}

export const sequences2strands = (sequences, padding = 0) => {
  const domainY = getSequencesDomainY(sequences)
  const silhouette = makeEmptySilhouette(domainY)
  return seqs2strands(sequences, silhouette, padding)
}
