import { useState, useEffect, useRef, useMemo, CSSProperties } from "react";

type RealtimeChartProps = {
  data: Array<{ time: string; y: string }>;
  height: number;
  width: number;
};

type StatusLevel = "high" | "medium" | "low";

const RealtimeChart = (props: RealtimeChartProps) => {
  const { data, height, width } = props;
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use external data if provided, otherwise use internal state

  const TIME_WIDTH = 120;
  const LABEL_WIDTH = 80;
  const TIME_LABEL_MARGIN = 5;
  const PADDING_LEFT = 20;

  const STATUS_LEVELS: Record<StatusLevel, number> = {
    high: height * 0.1,
    medium: height * 0.5,
    low: height * 0.9,
  };

  const isStatusLevel = (value: string): value is StatusLevel => {
    return value in STATUS_LEVELS;
  };

  const styles = useMemo(() => {
    const wrapper: CSSProperties = {
      marginTop: "5px",
      position: "relative",
      width: "100%",
      maxWidth: `${width / 16}rem`,
      height: `${(height + 40) / 16}rem`,
      backgroundColor: "#0F1114",
      borderRadius: "5px",
    };

    const container: CSSProperties = {
      width: "100%",
      height: `${(height + 40) / 16}rem`,
      backgroundColor: "#0F1114",
      position: "relative",
      overflow: "hidden",
    };

    const scrollContainer: CSSProperties = {
      width: `calc(100% - ${LABEL_WIDTH / 16}rem)`,
      height: "100%",
      overflowX: "auto",
      position: "absolute",
      left: `${LABEL_WIDTH / 16}rem`,
      scrollbarWidth: "none", // Not standard, workaround
      msOverflowStyle: "none", // Not standard, workaround
    };

    const fixedLabels: CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0,
      width: `${LABEL_WIDTH / 16}rem`,
      height: `${height / 16}rem`,
      backgroundColor: "#0F1114",
      zIndex: 2,
    };

    const horizontalLine: CSSProperties = {
      stroke: "#333",
      strokeWidth: 1,
    };

    const timeText: CSSProperties = {
      fill: "#9CA3AF",
      fontSize: "12px",
    };

    const statusText: CSSProperties = {
      fill: "#9CA3AF",
      fontSize: "14px",
      dominantBaseline: "middle",
    };

    const dataLine: CSSProperties = {
      fill: "none",
      stroke: "#fff",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transition: "d 0.3s ease-in-out",
    };

    return {
      wrapper,
      container,
      scrollContainer,
      fixedLabels,
      horizontalLine,
      timeText,
      statusText,
      dataLine,
    };
  }, [height, width]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 10;
      setIsScrolledToEnd(isAtEnd);
    }
  };

  useEffect(() => {
    if (containerRef.current && data?.length > 0 && isScrolledToEnd) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [data, isScrolledToEnd]);

  const formatTime = (dateTime: Date) => {
    const date = new Date(dateTime);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const totalWidth = Math.max(width, (data?.length || 1) * TIME_WIDTH);

  const generatePath = () => {
    const validData = data?.filter((d) => d.y) || [];

    if (validData?.length < 2) return "";

    const points = validData?.map((d, i) => {
      console.log("ini apa", d);
      const yValue = isStatusLevel(d.y)
        ? STATUS_LEVELS[d.y]
        : STATUS_LEVELS.low;

      return {
        x: i * TIME_WIDTH,
        y: yValue,
      };
    });

    const path = points?.reduce((acc, point, i, arr) => {
      if (i === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const prevPoint = arr[i - 1];
      const controlPoint1X = prevPoint.x + TIME_WIDTH / 3;
      const controlPoint2X = point.x - TIME_WIDTH / 3;

      return `${acc} C ${controlPoint1X} ${prevPoint.y}, ${controlPoint2X} ${point.y}, ${point.x} ${point.y}`;
    }, "");

    return path;
  };

  // Calculate the actual height needed for the SVG
  const svgHeight = height + TIME_LABEL_MARGIN + 20; // Added extra space for datetime labels

  return (
    <div style={styles.wrapper}>
      <div style={styles.fixedLabels}>
        <svg width={LABEL_WIDTH} height={svgHeight}>
          {Object.entries(STATUS_LEVELS).map(([status, y]) => (
            <text key={status} x="10" y={y} style={styles.statusText}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </text>
          ))}
        </svg>
      </div>

      <div
        ref={containerRef}
        style={styles.scrollContainer}
        onScroll={handleScroll}
      >
        <svg width={totalWidth} height={svgHeight}>
          {Object.entries(STATUS_LEVELS).map(([status, y]) => (
            <line
              key={status}
              x1="0"
              y1={y}
              x2={totalWidth}
              y2={y}
              style={styles.horizontalLine}
            />
          ))}

          {data?.map((point, index) => (
            <text
              key={index}
              x={index * TIME_WIDTH + PADDING_LEFT}
              y={height + TIME_LABEL_MARGIN + 15} // Adjusted position with margin
              style={styles.timeText}
              textAnchor="middle"
            >
              {formatTime(new Date(point.time))}
            </text>
          ))}

          <path d={generatePath()} style={styles.dataLine} />
        </svg>
      </div>
    </div>
  );
};

export default RealtimeChart;
