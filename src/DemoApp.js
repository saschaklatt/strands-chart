import "./App.css"
import React from "react"
import StrandsChart from "./strands-chart"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { importUsages, getData } from "./models/StrandParser"
import { importTimePeriods } from "./models/time-periods"
import { timeParse } from "d3-time-format"
import compose from "lodash/fp/compose"

const CustomSection = ({ data }) => (
  <>
    <span>{data.position}</span>
    <span>{`@ ${data.organisation}`}</span>
  </>
)

const parseTime = timeParse("%m/%Y") // "month/year": 09/2016

const getStart = d => d.start

const getDate = compose(
  parseTime,
  getStart
)

const StrandButtons = ({ sequences }) => {}

function App({ width, height }) {
  const sequences = importUsages(LANG_USAGE) //.map(getData)
  console.log("sequences", sequences)

  const periods = importTimePeriods({
    periods: TIME_PERIODS,
    today: new Date(),
    getKey: getStart,
    height,
    getDate,
  })
  return (
    <div className="App">
      <StrandsChart
        width={width}
        height={height}
        sequences={sequences}
        periods={periods}
        renderSection={CustomSection}
      />
    </div>
  )
}

App.defaultProps = {
  width: 460,
  height: 720,
}

export default App
