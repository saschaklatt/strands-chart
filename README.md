# StrandsChart

Fully responsive diagram, based on React and D3, to compare values of different ranges over time in the form of strands. It's like a vertically stacked area chart where the areas are arranged alternately left and right around the y-axis.

<img src="./docs/screenshot.png">

## Install

There's no npm version available yet. It can still be installed from GitHub by adding the following line to your dependencies in your package.json file:

    "dependencies": {
      "strands-chart": "klattiation/strands-chart",
      ...
    }

## Docs

A full example can be found here: <a href="./src/DemoApp.js">DemoApp</a>

### Data structure

The chart uses two data sources: strands and periods.

### Sequences

A sequence is a list of numbers that represent the different widths of each area. A width is treated as a relative value compared to the width of other sequences. That means if sequence A has width of 1 at index 0 and sequence B has a width of 2 at index 0, then sequence B will be twice as wide as sequence A at index 0.

A single sequence looks like this:

```json
{
  "key": "someUniqueString",
  "data": [0, 1, 2, 2, 3, 1, 0, 0, 0, 1],
},
```

Sequences will be sorted by their surface area and then positioned alternately left and right on the y-axis.

### Periods

Periods are the sections in which the chart is divided vertically.

They can be generated from a base format by using the `importTimePeriods` function. It transforms the input data, which has to be an array of "sections" into periods. A sections can contain any data. The only requirement is that it contains a start date and a unique key. The start date will then be read by a `getDate` accessor function, that you also need provide. Similarly the `getKey` accessor function has to return a unique key for each section.

Your input data could look like this:

```json
[
  {
    "start": "01/2019",
    "position": "Freelance Software Engineer, Frontend",
    "organisation": "Sascha Klatt - Digital Arts",
    "location": "Leipzig"
  },
  ...
]
```

Using the `importTimePeriods` function like this:

```javascript
import TIME_PERIODS from "./data/time-periods.json" // see src/data/time-periods.json

importTimePeriods({
  periods: TIME_PERIODS, // data source
  today: new Date(), // the date where the chart ends (might be renamed in future versions)
  getKey: d => d.start, // extracts a unique key for each period
  height: height, // the chart height
  getDate: d => d3.timeParse("%m%Y")(d.start), // extracts the date from each period as a JavaScript Date object
})
```

Will transform your base data into this:

```json
[
  {
    "data": {
      "start": "01/2019",
      "position": "Freelance Software Engineer, Frontend",
      "organisation": "Sascha Klatt - Digital Arts",
      "location": "Leipzig"
    },
    "key": "01/2019",
    "time": "2019-01-01T00:00:00.000Z",
    "y": 28,
    "height": 28
  },
  ...
]
```

In order to display your sections you can pass a `renderSection` render prop into the StrandChart.

```jsx
import StrandsChart from "strands-chart"

const CustomSection = ({ data }) => (
  <ul>
    <li>{`Position: ${data.position}`}</li>
    <li>{`Organisation: ${data.organisation}`}</li>
    <li>{`Location: ${data.location}`}</li>
  </ul>
)

const Demo = () => <StrandsChart renderSection={CustomSection} ... />
```

The CustomSection receives all the data from your base format as a `data` prop.
