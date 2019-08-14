import React from "react"
import "./App.css"
import StrandsChart from "./strands-chart"
// import KebabChart from "./kebab-chart"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { importUsages } from "./models/StrandParser"
import { importTimePeriods } from "./models/time-periods"

function App() {
  const width = 460
  const height = 720

  const sequences = importUsages(LANG_USAGE).map(v => v.data)
  const periods = importTimePeriods({
    periods: TIME_PERIODS,
    today: new Date(),
    width,
    height,
  })
  console.log("sequences", sequences)

  return (
    <div className="App">
      {/* <KebabChart width={460} height={720} /> */}
      <StrandsChart
        width={width}
        height={height}
        sequences={sequences}
        periods={periods}
      />
    </div>
  )
}

export default App
