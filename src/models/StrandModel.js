import { isNil, makeLinearScaler, reverse, pixel2str } from "../utils"

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

const withoutNil = ([p1, p2]) => !isNil(p1) && !isNil(p2)

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
  const move = makeTupleValueMover(dx)
  return move(v)
}

export const makeSequenceExtender = dx => sequence =>
  sequence.map(extendSequenceValue(dx))

const makeVerticalStrand = (x, width, height) =>
  Array.from({ length: height }, () => makeTuple(x, x + width))

export const makeInitialSilhouette = (domainY, padding) => {
  const maxY = getDomainWidth(domainY)
  return makeVerticalStrand(0, padding, maxY)
}

const seqs2strands = (sequences, silhouette, pad, strands = [], i = 0) => {
  if (i >= sequences.length) {
    return strands
  }

  const seq = sequences[i]
  const dir = i % 2 ? 1 : -1
  const makeDirectedSnuggler = makeStrandSnuggler(dir)
  const snuggleWithSilhouette = makeDirectedSnuggler(silhouette)
  const addPadding = makeSequenceExtender(pad)

  const extendSilhouette = makeStrandExtender(dir)(silhouette)
  const seqWithPadding = addPadding(seq)
  const newSilhouette = extendSilhouette(seqWithPadding)

  const strand = snuggleWithSilhouette(strandFromSequence(seq))
  const newStrands = [...strands, strand]

  return seqs2strands(sequences, newSilhouette, pad, newStrands, i + 1)
}

const fillUpStrand = (strand, targetLength) => {
  if (strand.length >= targetLength) {
    return strand
  }
  const newStrand = [...strand, [null, null]]
  return fillUpStrand(newStrand, targetLength)
}

const makeStrandFiller = maxY => strands => {
  return strands.map(strand => fillUpStrand(strand, maxY))
}

export const sequences2strands = (sequences, padding = 0) => {
  const domainY = getSequencesDomainY(sequences)
  const silhouette = makeInitialSilhouette(domainY, padding)
  const fillUp = makeStrandFiller(Math.max(...domainY)) // TODO: check if this is necessary
  return fillUp(seqs2strands(sequences, silhouette, padding))
}

const getLeftValues = strand => strand.map(tuple => tuple[0])

const getRightValues = strand => strand.map(tuple => tuple[1])

const getStrandsDomainX = strands => {
  return strands.reduce(
    (domain, strand) => {
      const min = Math.min(...getLeftValues(strand))
      const max = Math.max(...getRightValues(strand))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [Infinity, -Infinity]
  )
}

const getStrandsDomainY = strands => {
  return strands.reduce(
    (domain, strand) => {
      const max = Math.max(domain[1], strand.length - 1)
      return [0, max]
    },
    [0, -Infinity]
  )
}

const makePointToPixelConverter = (scaleX, scaleY) => ([x, y]) => [
  isNil(x) ? null : scaleX(x),
  isNil(x) ? null : scaleY(y), // Hint: isNil(x) is no mistake: no x means no value at all
]

const tuples2shape = tuples => [
  ...getLeftValues(tuples),
  ...reverse(getRightValues(tuples)),
]

export const makePixelConverter = (rangeX, rangeY) => strands => {
  const domainX = getStrandsDomainX(strands)
  const domainY = getStrandsDomainY(strands)
  const scaleX = makeLinearScaler(domainX, rangeX)
  const scaleY = makeLinearScaler(domainY, rangeY)
  const pixel = makePointToPixelConverter(scaleX, scaleY)
  return strands.map(strand => {
    const pixelStrand = strand.map((tuple, idx) => [
      pixel([tuple[0], idx]),
      pixel([tuple[1], idx]),
    ])
    return tuples2shape(pixelStrand).filter(withoutNil)
  })
}

export const getPolygonPath = pixels =>
  pixels.reduce((path, pxl, idx, arr) => {
    const cmd = idx === 0 ? "M" : "L"
    const coords = pixel2str(pxl)
    const end = idx >= arr.length - 1 ? " Z" : ""
    return `${path} ${cmd}${coords}${end}`
  }, "")
