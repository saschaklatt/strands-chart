import {
  strandFromSequence,
  moveStrand,
  makeLeftExtender,
  makeRightExtender,
  makeSequenceExtender,
  makeLeftSnuggler,
  makeRightSnuggler,
  getSingleSequenceWidth,
  getMultiSequenceWidth,
  getSequencesDomainX,
  getSequencesDomainY,
  getDomainWidth,
  getDomainCenter,
  makeEmptySilhouette,
  sequences2strands,
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
        [[-3, 0], [-1, 0], [-2, 0], [-3, 0]],
        [[0, 0], [0, 2], [0, 1], [0, 0]],
        [[-4, -3], [-2, -1], [-4, -2], [-4, -3]],
      ])
    })

    it("creates strands with padding", () => {
      const padding = 1
      const sequences = [[3, 1, 2, 3], [0, 2, 1, 0], [1, 1, 2, 1]]
      const strands = sequences2strands(sequences, padding)

      expect(strands).toEqual([
        [[-3, 0], [-1, 0], [-2, 0], [-3, 0]],
        [[1, 1], [1, 3], [1, 2], [1, 1]],
        [[-5, -4], [-3, -2], [-5, -3], [-5, -4]],
      ])
    })
  })
})

describe("moveStrand", () => {
  const mockStrand = () => [
    [null, null],
    [0, 0],
    [0, 4],
    [0, 3],
    [null, null],
    [0, 0],
    [null, null],
  ]

  it("moves a strand by the given value", () => {
    const dx = 10
    const mock = mockStrand()
    const strand = moveStrand(mock, dx)
    expect(strand).toEqual([
      [null, null],
      [10, 10],
      [10, 14],
      [10, 13],
      [null, null],
      [10, 10],
      [null, null],
    ])
  })

  it("doesn't move the strand by a null value", () => {
    const dx = null
    const mock = mockStrand()
    const strand = moveStrand(mock, dx)
    expect(strand).toEqual(mock)
  })

  it("doesn't move the strand by an undefined value", () => {
    const mock = mockStrand()
    const strand = moveStrand(mock)
    expect(strand).toEqual(mock)
  })
})

describe("extending", () => {
  const mockStrand = () => [
    [null, null],
    [10, 10],
    [10, 14],
    [10, 13],
    [null, null],
    [10, 10],
    [null, null],
  ]

  it("extends a tuple to the left", () => {
    const sequence = [1, 3, null, 0, null, 5, 1]
    const mock = mockStrand()
    const extendLeft = makeLeftExtender(mock)
    const strand = extendLeft(sequence)
    expect(strand).toEqual([
      [null, null],
      [7, 10],
      [10, 14],
      [10, 13],
      [null, null],
      [5, 10],
      [null, null],
    ])
  })

  it("extends a tuple to the right", () => {
    const sequence = [1, 3, null, 0, null, 5, 1]
    const mock = mockStrand()
    const extendRight = makeRightExtender(mock)
    const strand = extendRight(sequence)
    expect(strand).toEqual([
      [null, null],
      [10, 13],
      [10, 14],
      [10, 13],
      [null, null],
      [10, 15],
      [null, null],
    ])
  })

  it("extends a sequence", () => {
    const sequence = [1, 3, null, 0, null, 5, 1]
    const extend = makeSequenceExtender(1)
    const result = extend(sequence)
    expect(result).toEqual([2, 4, null, 1, null, 6, 2])
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

    const snuggleWith = makeLeftSnuggler(targetStrand)
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

    const snuggleWith = makeLeftSnuggler(targetStrand, padding)
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

    const snuggleWith = makeRightSnuggler(targetStrand)
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

    const snuggleWith = makeRightSnuggler(targetStrand, padding)
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
  it("calculates the x-domain of multiple sequences", () => {
    const padding = 1
    const sequences = [[1, -4, 9, null, 1], [4, 1, 2, 3], [4, 5, 1, 0, null]]
    const res = getSequencesDomainX(sequences, padding)
    expect(res).toEqual([0, 20])
  })

  it("calculates the y-domain of multiple sequences", () => {
    const sequences = [
      [1, -4, 9, null, 1, null, 1, 2, 3, 4],
      [4, 1, 2, 3],
      [4, 5, 1, 0, null],
    ]
    const res = getSequencesDomainY(sequences)
    expect(res).toEqual([10, 0])
  })

  it("returns the domain's width", () => {
    expect(getDomainWidth([0, 10])).toEqual(10)
    expect(getDomainWidth([5, 10])).toEqual(5)
    expect(getDomainWidth([-5, 10])).toEqual(15)
    expect(getDomainWidth([null, 10])).toEqual(null)
    expect(getDomainWidth([10, null])).toEqual(null)
  })

  it("returns the domain's center", () => {
    expect(getDomainCenter([0, 10])).toEqual(5)
    expect(getDomainCenter([5, 10])).toEqual(7.5)
    expect(getDomainCenter([-6, 10])).toEqual(2)
    expect(getDomainCenter([null, 10])).toEqual(null)
    expect(getDomainCenter([10, null])).toEqual(null)
  })
})

describe("silhouette", () => {
  it("creates a vertical strand at zero", () => {
    const domainY = [0, 4]
    const silhouette = makeEmptySilhouette(domainY)
    expect(silhouette).toEqual([[0, 0], [0, 0], [0, 0], [0, 0]])
  })
})
