import React from "react"
import "./App.css"
import StrandsChart from "./strands-chart"
// import KebabChart from "./kebab-chart"
import DATA from "./data/data.json"
import { importData } from "./models/StrandParser"

function App() {
  const sequences = importData(DATA).map(v => v.data)
  console.log("sequences", sequences)

  return (
    <div className="App">
      {/* <KebabChart width={460} height={720} /> */}
      <StrandsChart width={460} height={720} sequences={sequences} />
    </div>
  )
}

export default App
