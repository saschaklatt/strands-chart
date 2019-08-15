import { min } from "d3-array"
import { scaleTime } from "d3-scale"
import { isLast } from "../utils"
import compose from "lodash/fp/compose"

export const ATTR_TIME = "time"
export const ATTR_HEIGHT = "height"
export const ATTR_Y = "y"
export const ATTR_DATA = "data"
export const ATTR_KEY = "key"

const getTime = d => d[ATTR_TIME]

const getData = d => d[ATTR_DATA]

const nestData = periods => periods.map(p => ({ [ATTR_DATA]: { ...p } }))

const addTime = getDate => periods =>
  periods.map(p => ({
    ...p,
    [ATTR_TIME]: compose(
      getDate,
      getData
    )(p),
  }))

const addY = scaleY => periods =>
  periods.map(period => ({
    ...period,
    [ATTR_Y]: compose(
      Math.round,
      scaleY,
      getTime
    )(period),
  }))

const addHeight = rangeY => periods =>
  periods.map((period, idx, arr) => {
    const nextY = isLast(arr, idx) ? rangeY[1] : arr[idx + 1].y
    return {
      ...period,
      [ATTR_HEIGHT]: Math.round(period.y - nextY),
    }
  })

const addKey = getKey => periods =>
  periods.map(p => ({
    ...p,
    [ATTR_KEY]: getKey(getData(p)),
  }))

export const importTimePeriods = ({
  periods,
  height,
  today,
  getKey,
  getDate,
}) => {
  const nestedPeriods = compose(
    addTime(getDate),
    addKey(getKey),
    nestData
  )(periods)
  const domainY = [min(nestedPeriods, getTime), today]
  const rangeY = [height, 0]
  const scaleY = scaleTime()
    .domain(domainY)
    .range(rangeY)
  return compose(
    addHeight(rangeY),
    addY(scaleY)
  )(nestedPeriods)
}
