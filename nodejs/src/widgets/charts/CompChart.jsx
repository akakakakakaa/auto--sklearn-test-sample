import React from "react";
import { ResponsiveLine } from "@nivo/line";

const theme = {
  line: {
    stroke: "#ffffff",
    strokeWidth: 1,
    strokeOpacity: 0.35,
  },
};

const CompChart = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    theme={theme}
    id={"training-chart"}
    data={data}
    margin={{ top: 50, right: 140, bottom: 50, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="natural"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Time",
      legendOffset: 36,
      legendPosition: "middle",
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Accuracy",
      legendOffset: -50,
      legendPosition: "middle",
    }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    pointLabel={(d) => `Time: ${d.x}, Accuracy: ${d.y}`}
    //sliceTooltip={(slice) => <div>{slice.id}</div>}
    useMesh={true}
    tooltip={(point) => {
      console.dir(point);
      return (
        <div
          style={{
            background: "white",
            padding: "9px 12px",
            border: "1px solid #ccc",
            fontSize: `12px`,
            fontFamily: `GmarketSansMedium`,
          }}
        >
          <div>
            <strong>Time</strong> {point.point.data.xFormatted}
          </div>
          <div>
            <strong>Accuracy</strong> {point.point.data.yFormatted}
          </div>
        </div>
      );
    }}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

export default CompChart;
