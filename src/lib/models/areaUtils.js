/**
 * @fileoverview Converts strands into svg area paths.
 */

import { area } from "d3-shape"
import { curry, getCenter } from "../utils"

export const makeNewBornArea = curry(
  (curving, scaleX, scaleY, getData, strand) =>
    area()
      .curve(curving)
      .x0(d => scaleX(getCenter(d)))
      .x1(d => scaleX(getCenter(d)))
      .y(d => scaleY(d[2]))(getData(strand))
)

export const makeDeadArea = curry(
  (curving, scaleX, scaleY, getData, strand) => {
    return area()
      .curve(curving)
      .x0(d => scaleX(d[strand.dir > 0 ? 0 : 1]))
      .x1(d => scaleX(d[strand.dir > 0 ? 0 : 1]))
      .y(d => scaleY(d[2]))(getData(strand))
  }
)

export const makeMatureArea = curry(
  (curving, scaleX, scaleY, getData, strand) =>
    area()
      .curve(curving)
      .x0(d => scaleX(d[0]))
      .x1(d => scaleX(d[1]))
      .y(d => scaleY(d[2]))(getData(strand))
)
