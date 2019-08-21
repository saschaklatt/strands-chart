import React from "react"
import { bem } from "./StrandsChart"
import { PeriodsPropTypes } from "../propTypes"

const Periods = ({ periods, renderPeriod }) => (
  <div className={bem("periods")}>
    {periods.map((period, idx) => (
      <div key={period.key} style={{ flex: `1 1 ${period.height}px` }}>
        <div>{renderPeriod(period, idx)}</div>
      </div>
    ))}
  </div>
)

Periods.propTypes = PeriodsPropTypes

export default Periods
