import React from "react"
import "./App.css"
import StrandsChart from "./strands-chart"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { importUsages, getData } from "./models/StrandParser"
import { importTimePeriods } from "./models/time-periods"

const CustomSection = ({ data }, idx) => (
  <>
    <span>{data.position}</span>
    <span>{`@ ${data.organisation}`}</span>
  </>
)

function App({ width, height }) {
  const sequences = importUsages(LANG_USAGE).map(getData)
  const periods = importTimePeriods({
    periods: TIME_PERIODS,
    today: new Date(),
    height,
    getKey: d => d.start,
  })
  console.log(periods)
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
