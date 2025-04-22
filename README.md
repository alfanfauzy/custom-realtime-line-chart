# RealtimeChart Component

A dynamic, real-time visualization chart built with React that displays status levels over time with smooth animations.

![realtime-chart-demo](https://github.com/user-attachments/assets/fab0534b-07ea-4675-af38-9b07ef74cc61)

## Features


- Real-time data visualization with automatic scrolling
- Smooth Bezier curve transitions between data points
- Three status levels (high, medium, low) with clear visual distinction
- Time-stamped data points with formatted time labels
- Automatically scrolls to show the most recent data
- Customizable width and height
- Responsive design with rem-based sizing

## Tech Stack

- **React**: Frontend library for building the user interface
- **React Hooks**: useState, useEffect, useRef, and useMemo for state management and optimization
- **SVG**: Used for rendering the chart graphics
- **JavaScript ES6+**: Modern JavaScript features for clean, efficient code
- **CSS-in-JS**: Inline styling with dynamic calculations based on props

## Installation

```bash
npm install realtime-chart
# or
yarn add realtime-chart
```

## Usage

```jsx
import { useState, useEffect } from 'react';
import RealtimeChart from './RealtimeChart';

const STATUS = ['low', 'medium', 'high'];

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Optional: Add initial data points if desired
    // const initialData = [...]; 
    // setData(initialData);
    
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toISOString(),
        y: STATUS[Math.floor(Math.random() * STATUS.length)],
      };
      setData((prev) => [...prev, newPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <RealtimeChart data={data} width={1200} height={200} />;
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | [] | Array of data points with `time` (ISO string) and `y` (status level) properties |
| `width` | Number | 1200 | Width of the chart in pixels |
| `height` | Number | 200 | Height of the chart in pixels |

## Data Format

Each data point should follow this structure:

```js
{
  time: "2025-04-22T15:30:45.123Z", // ISO formatted timestamp
  y: "high" // Status value: "high", "medium", or "low"
}
```

## Component Structure

- **RealtimeChart**: The main component that renders the chart
  - Fixed labels on the left side showing status levels
  - Scrollable container for the chart data
  - SVG elements for the chart visualization
    - Horizontal grid lines for each status level
    - Time labels for each data point
    - Smooth path connecting the data points

## Customization

You can customize the appearance of the chart by modifying the styles in the `styles` object:

```jsx
// Modify colors
styles.dataLine.stroke = "#00ff00"; // Change the line color
styles.wrapper.backgroundColor = "#ffffff"; // Change the background color

// Modify dimensions
const TIME_WIDTH = 80; // Change the width between data points
```

## Performance Considerations

- Uses `useMemo` to avoid recalculating styles on every render
- Optimized scrolling behavior that only auto-scrolls when at the end
- References for DOM elements to avoid unnecessary re-renders

## License

MIT
