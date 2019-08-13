import {
  strandFromSequence,
  getSingleSequenceWidth,
  getMultiSequenceWidth,
  getDomainSize,
  makeInitialSilhouette,
  sequences2strands,
  makeStrandSnuggler,
} from "./StrandModel"

describe("sequence to strand conversion", () => {
  describe("strandFromSequence", () => {
    it("creates a strand from a sequence", () => {
      const seq = [0, 1, 2, 3, 1]
      const strand = strandFromSequence(seq)
      expect(strand).toEqual([[0, 0], [0, 1], [0, 2], [0, 3], [0, 1]])
    })

    it("creates a tuple with null values", () => {
      const seq = [null, null, 4, 3, 4, null, null]
      const strand = strandFromSequence(seq)
      expect(strand).toEqual([
        [null, null],
        [null, null],
        [0, 4],
        [0, 3],
        [0, 4],
        [null, null],
        [null, null],
      ])
    })

    it("creates a tuple with null values in the middle", () => {
      const seq = [1, null, null, 4, 3, 4]
      const strand = strandFromSequence(seq)
      expect(strand).toEqual([
        [0, 1],
        [null, null],
        [null, null],
        [0, 4],
        [0, 3],
        [0, 4],
      ])
    })
  })

  describe("sequences2strands", () => {
    it("creates and positions strands from raw sequences", () => {
      const sequences = [[3, 1, 2, 3], [0, 2, 1, 0], [1, 1, 2, 1]]
      const strands = sequences2strands(sequences)

      expect(strands).toEqual([
        [[-3, 0, 0], [-1, 0, 1], [-2, 0, 2], [-3, 0, 3]],
        [[0, 0, 0], [0, 2, 1], [0, 1, 2], [0, 0, 3]],
        [[-4, -3, 0], [-2, -1, 1], [-4, -2, 2], [-4, -3, 3]],
      ])
    })

    it("creates strands with padding", () => {
      const padding = 1
      const sequences = [[3, 1, 2, 3], [0, 2, 1, 0], [1, 1, 2, 1], [1, 2, 2, 2]]
      const strands = sequences2strands(sequences, padding)

      expect(strands).toEqual([
        [[-3, 0, 0], [-1, 0, 1], [-2, 0, 2], [-3, 0, 3]],
        [[1, 1, 0], [1, 3, 1], [1, 2, 2], [1, 1, 3]],
        [[-5, -4, 0], [-3, -2, 1], [-5, -3, 2], [-5, -4, 3]],
        [[2, 3, 0], [4, 6, 1], [3, 5, 2], [2, 4, 3]],
      ])
    })

    it("creates strands with and filter null values", () => {
      const padding = 1
      const sequences = [[3, 1, 2, 3], [null, 2, 1, 0], [1, 1, null, 1]]
      const strands = sequences2strands(sequences, padding)

      expect(strands).toEqual([
        [[-3, 0, 0], [-1, 0, 1], [-2, 0, 2], [-3, 0, 3]],
        [[1, 3, 1], [1, 2, 2], [1, 1, 3]],
        [[-5, -4, 0], [-3, -2, 1], [-5, -4, 3]],
      ])
    })
  })
})

describe("snuggling", () => {
  it("snuggles left", () => {
    const targetStrand = [
      [null, null],
      [null, null],
      [null, null],
      [10, 10],
      [9, 10],
      [7, 10],
      [7, 10],
      [7, 10],
      [6, 10],
      [8, 10],
      [9, 10],
      [10, 10],
    ]
    const baseStrand = [
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [0, 0],
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 1],
      [0, 0],
      [null, null],
    ]

    const snuggleWith = makeStrandSnuggler(-1)(targetStrand)
    const result = snuggleWith(baseStrand)

    expect(result).toEqual([
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [7, 7],
      [4, 7],
      [5, 7],
      [5, 6],
      [7, 8],
      [9, 9],
      [null, null],
    ])
  })

  it("snuggles left with padding", () => {
    const padding = 1
    const targetStrand = [
      [null, null],
      [null, null],
      [null, null],
      [10, 10],
      [9, 10],
      [7, 10],
      [7, 10],
      [7, 10],
      [6, 10],
      [8, 10],
      [9, 10],
      [10, 10],
    ]
    const baseStrand = [
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [0, 0],
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 1],
      [0, 0],
      [null, null],
    ]

    const snuggleLeft = makeStrandSnuggler(-1)
    const snuggleWith = snuggleLeft(targetStrand, padding)
    const result = snuggleWith(baseStrand)

    expect(result).toEqual([
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [6, 6],
      [3, 6],
      [4, 6],
      [4, 5],
      [6, 7],
      [8, 8],
      [null, null],
    ])
  })

  it("snuggles right", () => {
    const targetStrand = [
      [10, 14],
      [10, 13],
      [10, 12],
      [10, 12],
      [9, 13],
      [7, 10],
      [4, 10],
      [5, 10],
      [5, 10],
    ]
    const baseStrand = [
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 3],
      [0, 1],
      [0, 0],
      [null, null],
    ]

    const snuggleRight = makeStrandSnuggler(1)
    const snuggleWith = snuggleRight(targetStrand)
    const result = snuggleWith(baseStrand)

    expect(result).toEqual([
      [14, 16],
      [13, 15],
      [12, 14],
      [12, 14],
      [13, 15],
      [10, 13],
      [10, 11],
      [10, 10],
      [null, null],
    ])
  })

  it("snuggles right with padding", () => {
    const padding = 1
    const targetStrand = [
      [10, 14],
      [10, 13],
      [10, 12],
      [10, 12],
      [9, 13],
      [7, 10],
      [4, 10],
      [5, 10],
      [5, 10],
    ]
    const baseStrand = [
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 3],
      [0, 1],
      [0, 0],
      [null, null],
    ]

    const snuggleRight = makeStrandSnuggler(1)
    const snuggleWith = snuggleRight(targetStrand, padding)
    const result = snuggleWith(baseStrand)

    expect(result).toEqual([
      [15, 17],
      [14, 16],
      [13, 15],
      [13, 15],
      [14, 16],
      [11, 14],
      [11, 12],
      [11, 11],
      [null, null],
    ])
  })
})

describe("sequence width", () => {
  it("calculates a single sequence width", () => {
    const seq = [1, -4, 9, null, 1]
    const res = getSingleSequenceWidth(seq)
    expect(res).toEqual(9)
  })

  it("calculates the total width of multiple sequences", () => {
    const sequences = [[1, -4, 9, null, 1], [4, 1, 2, 3], [4, 5, 1, 0, null]]
    const res = getMultiSequenceWidth(sequences)
    expect(res).toEqual(18)
  })

  it("calculates the total width of multiple sequences with padding", () => {
    const padding = 1
    const sequences = [[1, -4, 9, null, 1], [4, 1, 2, 3], [4, 5, 1, 0, null]]
    const res = getMultiSequenceWidth(sequences, padding)
    expect(res).toEqual(20)
  })
})

describe("domains", () => {
  it("returns the domain's width", () => {
    expect(getDomainSize([0, 10])).toEqual(10)
    expect(getDomainSize([5, 10])).toEqual(5)
    expect(getDomainSize([-5, 10])).toEqual(15)
    expect(getDomainSize([null, 10])).toEqual(null)
    expect(getDomainSize([10, null])).toEqual(null)
  })
})

describe("silhouette", () => {
  it("creates a vertical strand at zero", () => {
    const domainY = [0, 4]
    const silhouette = makeInitialSilhouette(domainY, 1)
    expect(silhouette).toEqual([[0, 1], [0, 1], [0, 1], [0, 1]])
  })
})
