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
import { curveMonotoneY } from "d3-shape"
import { getBemClassName, reverse } from "../utils"
import { timeFormat } from "d3-time-format"
import {
  ATTR_TIME,
  ATTR_HEIGHT,
  ATTR_Y,
  ATTR_DATA,
  ATTR_KEY,
} from "../constants"
import { select } from "d3-selection"
import { scaleLinear } from "d3-scale"
import { transition } from "d3-transition"
import { getData } from "../models/StrandParser"

const bem = getBemClassName("strands-chart")

export const makeDateRenderer = format => ({ time }) => timeFormat(format)(time)

export const makeSectionRenderer = () => (period, idx) => (
  <>{`Section ${idx}`}</>
)

const Dates = ({ periods, renderDate }) => (
  <div className={bem("dates")}>
    {periods.map((period, idx) => (
      <span key={period.key} style={{ height: `${period.height}px` }}>
        {renderDate(period, idx)}
      </span>
    ))}
  </div>
)

const Sections = ({ periods, renderSection }) => (
  <div className={bem("sections")}>
    {periods.map((period, idx) => (
      <div key={period.key} style={{ flex: `1 1 ${period.height}px` }}>
        <div>{renderSection(period, idx)}</div>
      </div>
    ))}
  </div>
)

const Lines = ({ periods }) => (
  <div className={bem("lines")}>
    {periods.map(({ height, key }) => (
      <span key={key} style={{ height: `${height}px` }} />
    ))}
  </div>
)

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

  shouldComponentUpdate() {
    return false
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
      .attr("stroke-width", `${padding}px`)
      .attr("d", bornArea)
      .transition(t)
      .attr("d", matureArea)

    paths
      .merge(paths)
      .transition(t)
      .attr("d", matureArea)

    paths
      .exit()
      .transition(t)
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

const StrandsChart = props => (
  <figure className={bem()} style={{ height: `${props.height}px` }}>
    <Dates {...props} />
    <div className={bem("lined")}>
      <Lines {...props} />
      <Strands {...props} />
      <Sections {...props} />
    </div>
  </figure>
)

const SequencePropType = PropTypes.shape({
  [ATTR_KEY]: PropTypes.string,
  [ATTR_DATA]: PropTypes.arrayOf(PropTypes.number),
})

const PeriodPropType = PropTypes.shape({
  [ATTR_TIME]: PropTypes.object.isRequired,
  [ATTR_HEIGHT]: PropTypes.number.isRequired,
  [ATTR_Y]: PropTypes.number.isRequired,
  [ATTR_DATA]: PropTypes.any.isRequired,
})

StrandsChart.propTypes = {
  curving: PropTypes.func,
  padding: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sequences: PropTypes.arrayOf(SequencePropType).isRequired,
  periods: PropTypes.arrayOf(PeriodPropType).isRequired,
  renderDate: PropTypes.func.isRequired,
  renderSection: PropTypes.func.isRequired,
  getColor: PropTypes.func.isRequired,
}

StrandsChart.defaultProps = {
  curving: curveMonotoneY,
  padding: 3,
  renderDate: makeDateRenderer("%Y"),
  renderSection: makeSectionRenderer(),
}

export default StrandsChart
