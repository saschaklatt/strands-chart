import isNil from "lodash/isNil"
import { curry } from "../utils"

const getColumn = curry((idx, grid) => grid.map(row => row[idx]))

const getLeftValues = getColumn(0)

const getRightValues = getColumn(1)

export const getDomainX = list =>
  list.reduce(
    (domain, data) => {
      const min = Math.min(...getLeftValues(data))
      const max = Math.max(...getRightValues(data))
      return [Math.min(domain[0], min), Math.max(domain[1], max)]
    },
    [0, 0]
  )

export const getDomainY = list => [
  0,
  list.reduce((max, arr) => Math.max(max, arr.length - 1), 0),
]

export const isNilDomain = d => isNil(d) || isNil(d[0]) || isNil(d[1])

export const getDomainSize = d =>
  isNilDomain(d) ? null : Math.abs(d[1] - d[0])
