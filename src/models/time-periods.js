import { min } from "d3-array"
import { scaleTime } from "d3-scale"
import { timeFormat, timeParse } from "d3-time-format"
import { isLast } from "../utils"

/**
 * [
 *   {
 *     yLine: 255,
 *     yLabel: 180,
 *     start: 2005,
 *     label: "School Leaving Examination (Fachabitur)",
 *     organization: "Fortis Akademie",
 *     location: "Chemnitz"
 *   },
 *   ...
 * ]
 */

const TIME_FORMAT = "%m/%Y" // "month/year": 09/2016

const parseTime = timeParse(TIME_FORMAT)

const formatTimeLabel = timeFormat("%Y")

const getTime = d => d.startTime

const getYear = d => d.start

const addTime = periods =>
  periods.map(p => ({
    ...p,
    startTime: parseTime(getYear(p)),
  }))

export const importTimePeriods = ({ periods, width, height, today }) => {
  const periodsWithTime = addTime(periods)
  const domainY = [min(periodsWithTime, getTime), today]
  const rangeY = [height, 0]
  const scaleY = scaleTime()
    .domain(domainY)
    .range(rangeY)

  const halfTextHeight = 8

  return periodsWithTime
    .map(period => {
      const time = getTime(period)
      const yLine = Math.round(scaleY(time))
      const yYear = yLine - halfTextHeight
      return {
        ...period,
        yLine,
        yYear,
        year: formatTimeLabel(time),
      }
    })
    .map((period, idx, arr) => {
      const nextY = isLast(arr, idx) ? rangeY[1] : arr[idx + 1].yLine
      return {
        ...period,
        yPosition: period.yLine + halfTextHeight + (nextY - period.yLine) / 2,
      }
    })
    .map((period, idx, arr) => {
      const nextY = isLast(arr, idx) ? rangeY[1] : arr[idx + 1].yLine
      return {
        ...period,
        flexYear: Math.round(period.yLine - nextY),
      }
    })
}
