import { isNil } from "../utils"

const makeBaseTuple = v => (isNil(v) ? [null, null] : [0, v])

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

export const moveStrand = (tuples, dx) => tuples.map(moveTuple(dx))

const makeStrandExtender = direction => strand => sequence => {
  return strand.map((t, i) => {
    const dx = sequence[i] * direction
    const move = makeTupleValueMover(dx)
    return direction < 0 ? [move(t[0]), t[1]] : [t[0], move(t[1])]
  })
}

export const makeLeftExtender = makeStrandExtender(-1)
export const makeRightExtender = makeStrandExtender(1)

const isNilTuple = ([x1, x2]) => isNil(x1) || isNil(x2)

const getTupleWidth = ([x1, x2]) => x2 - x1

const makeStrandSnuggler = dir => (baseStrand, pad = 0) => targetStrand => {
  return baseStrand.map((t, i) => {
    if (isNilTuple(t) || isNilTuple(targetStrand[i])) {
      return t
    }
    const sideIdx = dir < 0 ? 0 : 1
    const x = targetStrand[i][sideIdx] + pad * dir
    const w = getTupleWidth(t)
    const left = dir < 0 ? x - w : x
    const right = dir < 0 ? x : x + w
    const setLeft = makeTupleValueSetter(left)
    const setRight = makeTupleValueSetter(right)
    return [setLeft(t[0]), setRight(t[1])]
  })
}

export const makeLeftSnuggler = makeStrandSnuggler(-1)
export const makeRightSnuggler = makeStrandSnuggler(1)

export const getSequenceMax = sequence => Math.max(...sequence)

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

export default function(sequence) {
  const state = {
    tuples: strandFromSequence(sequence),
    max: getSequenceMax(sequence),
  }

  const api = {
    getData: () => Object.freeze(state),
    move: dx => {
      state.tuples = moveStrand(state.tuples, dx)
      return api
    },
    extendLeft: otherSequence => {
      const extendLeft = makeLeftExtender(state.tuples)
      state.tuples = extendLeft(otherSequence)
      return api
    },
    extendRight: otherSequence => {
      const extendRight = makeRightExtender(state.tuples)
      state.tuples = extendRight(otherSequence)
      return api
    },
  }
  return api
}
