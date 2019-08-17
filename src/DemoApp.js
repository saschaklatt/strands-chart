import "./DemoApp.css"
import React from "react"
import StrandsChart from "./lib"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { importSequences } from "./sequencesParser"
import { importTimePeriods } from "./lib/models/timePeriodsConverter"
import { timeParse } from "d3-time-format"
import compose from "lodash/fp/compose"
import { ATTR_KEY, ATTR_COLOR, ATTR_DATA } from "./lib/models/selectors"
import { seqs2strands } from "./lib/models/strandsConverter"

const CustomSection = ({ data }) => (
  <>
    <span>{data.position}</span>
    <span>{`@ ${data.organisation}`}</span>
  </>
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

    const parseTime = timeParse("%m/%Y") // "month/year": 09/2016

    const getStart = d => d.start

    const periods = importTimePeriods({
      periods: TIME_PERIODS,
      today: new Date(),
      getKey: getStart,
      height: props.height,
      getDate: compose(
        parseTime,
        getStart
      ),
    })
    const sequences = importSequences(LANG_USAGE, props.colors)

    this.state = {
      sequences,
      periods,
      selection: sequences.map(s => s[ATTR_KEY]),
    }
  }

  handleSelectionChange = key => {
    this.setState(({ selection }) => {
      const i = selection.indexOf(key)
      return i >= 0
        ? { selection: selection.filter(k => k !== key) }
        : { selection: [...selection, key] }
    })
  }

  render() {
    const { width, height } = this.props
    const { selection, sequences, periods } = this.state
    const visibleSequences = sequences.filter(s => selection.includes(s.key))
    const strands = seqs2strands(visibleSequences, ATTR_DATA)
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
          strands={strands}
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
  colors: [
    "#FF8A3C",
    "#F74444",
    "#93BFC7",
    "#4F795C",
    "#B672BC",
    "#39638D",
    "#F8F025",
    "#4E6ED6",
    "#B29D28",
    "#72BC78",
  ],
}

export default App
