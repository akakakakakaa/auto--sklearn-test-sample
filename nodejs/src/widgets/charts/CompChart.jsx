import React, { useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

const theme = {
  crosshair: {
    line: {
      stroke: "#e0e0e0",
      strokeWidth: 2,
      //strokeOpacity: 0.35,
    },
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
    animate={true}
    //useMesh={false}
    tooltip={(point) => {
      return (
        <div
          style={{
            background: "#1e2430",
            color: "rgb(148, 214, 197)",
            fontSize: `12px`,
            fontFamily: `GmarketSansMedium`,
            minWidth: "120px",
            position: `relative`,
          }}
        >
          <div style={{ transform: "translateY(-50%)" }}>
            <div>
              <strong style={{ float: "left" }}>Time</strong>
              <text style={{ float: "right" }}>
                {point.point.data.xFormatted}
              </text>
            </div>
            <div style={{ clear: "both" }}>
              <strong style={{ float: "left" }}>Accuracy</strong>
              <text style={{ float: "right" }}>
                {point.point.data.yFormatted}
              </text>
            </div>
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
