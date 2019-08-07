export const getMaxSequenceLength = sequences =>
  sequences.reduce((max, seq) => Math.max(max, seq.length - 1), 0)

export const isNil = v => v === null || v === undefined
