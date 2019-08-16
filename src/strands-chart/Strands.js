import "./StrandsChart.css"
import React from "react"
import PropTypes from "prop-types"
import {
  makeMatureArea,
  seqs2strands,
  getDomainX,
  getDomainY,
  makeDiedArea,
  makeBornArea,
} from "../models/strand-areas"
import { ATTR_DATA, ATTR_KEY } from "../constants"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { transition } from "d3-transition"
import { getData } from "../models/StrandParser"
import { bem } from "."
import { reverse, attrDiffers } from "../utils"

class Strands extends React.Component {
  constructor(props) {
    super(props)

    this.svg = React.createRef()
  }

  componentDidMount() {
    this.update(this.props, this.svg, 0)
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps, this.svg, 400)
  }

  shouldComponentUpdate(nextProps) {
    const propDiffers = attrDiffers(this.props, nextProps)
    return propDiffers("width") || propDiffers("height")
  }

  update(props, ref, duration) {
    const { width, height, curving, padding, sequences, getColor } = props

    const strands = seqs2strands(sequences, ATTR_DATA)
    const strandsData = strands.map(s => s[ATTR_DATA])

    const scaleX = scaleLinear()
      .domain(getDomainX(strandsData))
      .range([0, width])

    const scaleY = scaleLinear()
      .domain(getDomainY(strandsData))
      .range([height, 0])

    const t = transition().duration(duration)
    const tEnter = transition().duration(duration)
    if (duration > 0) {
      tEnter.delay(duration / 10)
    }

    const bornArea = makeBornArea(curving, scaleX, scaleY, getData)
    const diedArea = makeDiedArea(curving, scaleX, scaleY, getData)
    const matureArea = makeMatureArea(curving, scaleX, scaleY, getData)

    const paths = select(ref.current)
      .selectAll("path")
      .data(reverse(strands), d => d[ATTR_KEY])

    paths
      .enter()
      .append("path")
      .attr("class", bem("strand"))
      .attr("fill", getColor)
      .attr("stroke-width", 0)
      .style("opacity", 0)
      .attr("d", bornArea)
      .transition(tEnter)
      .style("opacity", 1)
      .attr("stroke-width", `${padding}px`)
      .attr("d", matureArea)

    paths
      .merge(paths)
      .transition(t)
      .attr("d", matureArea)

    paths
      .exit()
      .transition(t)
      .style("opacity", 0)
      .attr("d", diedArea)
      .remove()
  }

  render() {
    const { width, height } = this.props
    return (
      <div className={bem("strands")}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          ref={this.svg}
        />
      </div>
    )
  }
}

export default Strands
