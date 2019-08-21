import React from "react"
import { bem } from "./StrandsChart"
import { DatesPropTypes } from "../propTypes"

const Dates = ({ periods, renderDate }) => (
  <div className={bem("dates")}>
    {periods.map((period, idx) => (
      <span key={period.key} style={{ height: `${period.height}px` }}>
        {renderDate(period, idx)}
      </span>
    ))}
  </div>
)

Dates.propTypes = DatesPropTypes

export default Dates
