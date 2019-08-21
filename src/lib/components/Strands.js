import "./StrandsChart.css"
import React from "react"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { transition } from "d3-transition"
import {
  makeMatureArea,
  makeDeadArea,
  makeNewBornArea,
} from "../models/areaUtils"
import { getDomainX, getDomainY } from "../models/strandUtils"
import { ATTR_DATA, ATTR_KEY, getData } from "../models/selectors"
import { reverse, atLeastOneDiffers } from "../utils"
import { bem } from "./StrandsChart"
import { seqs2strands } from "../models/strandsConverter"

class Strands extends React.Component {
  constructor(props) {
    super(props)
    this.svg = React.createRef()
  }

  componentDidMount() {
    this.updateViz(this.props, this.svg, true)
  }

  componentWillReceiveProps(nextProps) {
    this.updateViz(nextProps, this.svg, false)
  }

  shouldComponentUpdate(nextProps) {
    return atLeastOneDiffers(this.props, nextProps, ["width", "height"])
  }

  updateViz(props, ref, isInitial) {
    const { width, height, curving, padding, sequences, getColor } = props

    const strands = seqs2strands(sequences, ATTR_DATA)
    console.log(strands)

    const strandsData = strands.map(s => s[ATTR_DATA])

    const scaleX = scaleLinear()
      .domain(getDomainX(strandsData))
      .range([0, width])

    const scaleY = scaleLinear()
      .domain(getDomainY(strandsData))
      .range([height, 0])

    const duration = isInitial ? 0 : 400

    const t = transition().duration(duration)
    const tEnter = transition().duration(duration)
    if (isInitial) {
      tEnter.delay(duration / 10)
    }

    const newBornArea = makeNewBornArea(curving, scaleX, scaleY, getData)
    const matureArea = makeMatureArea(curving, scaleX, scaleY, getData)
    const deadArea = makeDeadArea(curving, scaleX, scaleY, getData)

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
      .attr("d", newBornArea)
      .transition(tEnter)
      .style("opacity", 0.9)
      .attr("stroke-width", `${padding}px`)
      .attr("d", matureArea)

    paths
      .merge(paths)
      .transition(t)
      .attr("d", matureArea)

    paths
      .exit()
      .transition(t)
      .attr("d", deadArea)
      .style("opacity", 0)
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
