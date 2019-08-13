import React from "react"
import "./App.css"
import StrandsChart from "./strands-chart"
// import KebabChart from "./kebab-chart"

function App() {
  return (
    <div className="App">
      {/* <KebabChart width={460} height={720} /> */}
      <StrandsChart width={460} height={720} />
    </div>
  )
}

export default App
