import React from "react"
import { bem } from "./StrandsChart"
import { LinesPropTypes } from "../propTypes"

const Lines = ({ periods }) => (
  <div className={bem("lines")}>
    {periods.map(({ height, key }) => (
      <span key={key} style={{ height: `${height}px` }} />
    ))}
  </div>
)

Lines.propTypes = LinesPropTypes

export default Lines
