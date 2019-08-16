import "./App.css"
import React from "react"
import StrandsChart from "./strands-chart"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { importUsages } from "./models/StrandParser"
import { importTimePeriods } from "./models/time-periods"
import { timeParse } from "d3-time-format"
import compose from "lodash/fp/compose"
import { COLORS, ATTR_KEY, ATTR_COLOR } from "./constants"

const CustomSection = ({ data }) => (
  <>
    <span>{data.position}</span>
    <span>{`@ ${data.organisation}`}</span>
  </>
)

const parseTime = timeParse("%m/%Y") // "month/year": 09/2016

const getStart = d => d.start

const getDate = compose(
  parseTime,
  getStart
)

const Selection = ({ sequences, selection = [], onChange }) => (
  <div className="selection">
    {sequences.map(({ key }, idx) => (
      <div key={key}>
        <input
          type="checkbox"
          id={key}
          checked={selection.includes(key)}
          onChange={onChange.bind(this, key, idx)}
        />
        <label htmlFor={key}>{key}</label>
      </div>
    ))}
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)

    const periods = importTimePeriods({
      periods: TIME_PERIODS,
      today: new Date(),
      getKey: getStart,
      height: props.height,
      getDate,
    })
    const sequences = importUsages(LANG_USAGE, COLORS)

    this.state = {
      sequences,
      periods,
      selection: sequences.map(s => s[ATTR_KEY]),
    }
  }

  handleSelectionChange = key => {
    this.setState(({ selection }) => {
      const i = selection.indexOf(key)
      if (i >= 0) {
        return { selection: selection.filter(k => k !== key) }
      }
      return {
        selection: [...selection, key],
      }
    })
  }

  render() {
    const { width, height } = this.props
    const { selection, sequences, periods } = this.state
    const visibleSequences = sequences.filter(s => selection.includes(s.key))
    // console.log("sequences", visibleSequences)
    return (
      <div className="App">
        <Selection
          sequences={sequences}
          selection={selection}
          onChange={this.handleSelectionChange}
        />
        <StrandsChart
          width={width}
          height={height}
          sequences={visibleSequences}
          periods={periods}
          renderSection={CustomSection}
          getColor={d => d[ATTR_COLOR]}
        />
      </div>
    )
  }
}
App.defaultProps = {
  width: 460,
  height: 720,
}

export default App
