import React from "react"
import { bem } from "."

const Dates = ({ periods, renderDate }) => (
  <div className={bem("dates")}>
    {periods.map((period, idx) => (
      <span key={period.key} style={{ height: `${period.height}px` }}>
        {renderDate(period, idx)}
      </span>
    ))}
  </div>
)

export default Dates
