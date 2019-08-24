import "./StrandsChart.css"
import React from "react"
import noop from "lodash/noop"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { transition } from "d3-transition"
import {
  makeMatureArea,
  makeDeadArea,
  makeNewBornArea,
} from "../models/areaUtils"
import { getDomainX, getDomainY } from "../models/strandUtils"
import { ATTR_DATA, ATTR_KEY, getData, getColor } from "../models/selectors"
import { reverse, atLeastOneDiffers } from "../utils"
import { bem } from "./StrandsChart"
import { seqs2strands } from "../models/strandsConverter"
import { StrandsPropTypes } from "../propTypes"

const BEM_EL = "strand"
const BEM_MOD_HI = "highlight"
const BEM_MOD_LO = "lowlight"

const getClassNameHighlight = () => bem(BEM_EL, BEM_MOD_HI)
const getClassNameLowlight = () => bem(BEM_EL, BEM_MOD_LO)

const addClass = className =>
  function() {
    select(this).classed(className, true)
  }

const removeClass = className =>
  function() {
    select(this).classed(className, false)
  }

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
    const {
      width,
      height,
      curving,
      padding,
      sequences,
      onMouseEnterStrand = noop,
      onMouseLeaveStrand = noop,
      onClickStrand = noop,
    } = props

    const strands = seqs2strands(sequences, ATTR_DATA)
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

    const svg = select(ref.current)

    const paths = svg.selectAll("path").data(reverse(strands), d => d[ATTR_KEY])

    const handleMouseOver = function(d, i) {
      const classNameLowlight = getClassNameLowlight()
      const classNameHighlight = getClassNameHighlight()
      svg.selectAll("path").each(addClass(classNameLowlight))
      removeClass(classNameLowlight).call(this)
      addClass(classNameHighlight).call(this)
      onMouseEnterStrand(d, i)
    }

    const handleMouseOut = function(d, i) {
      const classNameLowlight = getClassNameLowlight()
      const classNameHighlight = getClassNameHighlight()
      svg.selectAll("path").each(removeClass(classNameLowlight))
      removeClass(classNameHighlight).call(this)
      onMouseLeaveStrand(d, i)
    }

    const handleClick = (d, i) => onClickStrand(d, i)

    paths
      .enter()
      .append("path")
      .attr("class", bem("strand"))
      .attr("fill", getColor)
      .attr("stroke-width", 0)
      .attr("d", newBornArea)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick)
      .transition(tEnter)
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
      .remove()
  }

  render() {
    const { width, height } = this.props
    return (
      <div className={bem(BEM_EL)}>
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

Strands.propTypes = StrandsPropTypes

export default Strands
