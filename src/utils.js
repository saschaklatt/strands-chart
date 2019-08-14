export const getMaxSequenceLength = sequences =>
  sequences.reduce((max, seq) => Math.max(max, seq.length - 1), 0)

export const isNil = v => v === null || v === undefined

export const isNotNil = v => v !== null && v !== undefined

export const getHalf = v => v / 2

export const scaleLinear = (value, domain, range) => {
  // calculate pct in original range
  const oDist = domain[1] - domain[0]
  const pct = (value - domain[0]) / oDist

  // apply pct value to target range
  const tDist = range[1] - range[0]
  return tDist * pct + range[0]
}

export const makeLinearScaler = (domain, range) => value =>
  scaleLinear(value, domain, range)

export const tuplesToOutlineLeft = tuples => tuples.map(tuple => tuple[0])

export const tuplesToOutlineRight = tuples =>
  tuples.map(tuple => tuple[1]).reverse()

export const reverse = ([head, ...tail]) =>
  tail.length === 0 ? [head] : [...reverse(tail), head]

export const pixel2str = p => `${p[0]} ${p[1]}`

export const getBemClassName = block => (element, modifier) => {
  if (element && modifier) {
    return `${block}--${element}__${modifier}`
  }
  if (element) {
    return `${block}--${element}`
  }
  return `${block}`
}

export const isLast = (arr, idx) => idx === arr.length - 1
