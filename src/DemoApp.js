import "./DemoApp.css"
import React from "react"
import StrandsChart, {
  importSequences,
  importTimePeriods,
  getKey,
  getColor,
} from "./lib"
import LANG_USAGE from "./data/languages-usage.json"
import TIME_PERIODS from "./data/time-periods.json"
import { timeParse } from "d3-time-format"
import compose from "lodash/fp/compose"

const CustomPeriod = ({ data }) => (
  <>
    <span>{data.position}</span>
    <span>{`@ ${data.organisation}`}</span>
  </>
)

const SelectionBar = ({ sequences, selection = [], onChange }) => (
  <div className="selection">
    {sequences.map((seq, idx) => {
      const key = getKey(seq)
      return (
        <div key={key}>
          <input
            type="checkbox"
            id={key}
            checked={selection.includes(key)}
            onChange={onChange.bind(this, key, idx)}
          />
          <label htmlFor={key}>
            <span className="circle" style={{ color: getColor(seq) }} />
            {key}
          </label>
        </div>
      )
    })}
  </div>
)

class App extends React.Component {
  constructor(props) {
    super(props)

    const parseTime = timeParse("%m/%Y") // "month/year": 09/2016

    const getStart = d => d.start

    const periods = importTimePeriods({
      periods: TIME_PERIODS,
      getKey: getStart,
      height: props.height,
      dateTo: new Date(),
      getDate: compose(parseTime, getStart),
    })
    const sequences = importSequences(LANG_USAGE, props.colors)

    this.state = {
      sequences,
      periods,
      selectedIndex: null,
      selection: sequences.map(getKey),
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
    const { selection, selectedIndex, sequences, periods } = this.state
    const visibleSequences = sequences.filter(s => selection.includes(s.key))
    // console.log("index", selectedIndex)
    return (
      <div className="App">
        <SelectionBar
          sequences={sequences}
          selection={selection}
          onChange={this.handleSelectionChange}
        />
        <StrandsChart
          width={width}
          height={height}
          sequences={visibleSequences}
          periods={periods}
          renderPeriod={CustomPeriod}
          onMouseEnterStrand={(d, i) => this.setState({ selectedIndex: i })}
          onMouseLeaveStrand={(d, i) => this.setState({ selectedIndex: null })}
          onClickStrand={(d, i) => console.log("click", d, i)}
          selectedIdx={selectedIndex}
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
