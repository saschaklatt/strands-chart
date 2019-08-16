import React from "react"
import { bem } from "."

const Sections = ({ periods, renderSection }) => (
  <div className={bem("sections")}>
    {periods.map((period, idx) => (
      <div key={period.key} style={{ flex: `1 1 ${period.height}px` }}>
        <div>{renderSection(period, idx)}</div>
      </div>
    ))}
  </div>
)

export default Sections
