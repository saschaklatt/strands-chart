import React from "react"
import { bem } from "."

const Lines = ({ periods }) => (
  <div className={bem("lines")}>
    {periods.map(({ height, key }) => (
      <span key={key} style={{ height: `${height}px` }} />
    ))}
  </div>
)

export default Lines
