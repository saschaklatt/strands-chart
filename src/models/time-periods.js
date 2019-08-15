import { min } from "d3-array"
import { scaleTime } from "d3-scale"
import { timeParse } from "d3-time-format"
import { isLast } from "../utils"
import compose from "lodash/fp/compose"

export const ATTR_TIME = "time"
export const ATTR_HEIGHT = "height"
export const ATTR_Y = "y"
export const DATA = "data"
export const KEY = "key"

const TIME_FORMAT = "%m/%Y" // "month/year": 09/2016
const parseTime = timeParse(TIME_FORMAT)

const getTime = d => d[ATTR_TIME]

const getYear = d => d.start

const getData = d => d.data

const nestData = periods => periods.map(p => ({ [DATA]: { ...p } }))

const addTime = periods =>
  periods.map(p => ({
    ...p,
    [ATTR_TIME]: compose(
      parseTime,
      getYear,
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
    [KEY]: getKey(getData(p)),
  }))

export const importTimePeriods = ({ periods, height, today, getKey }) => {
  const periodsWithTime = compose(
    addTime,
    addKey(getKey),
    nestData
  )(periods)
  const domainY = [min(periodsWithTime, getTime), today]
  const rangeY = [height, 0]
  const scaleY = scaleTime()
    .domain(domainY)
    .range(rangeY)
  return compose(
    addHeight(rangeY),
    addY(scaleY)
  )(periodsWithTime)
}
