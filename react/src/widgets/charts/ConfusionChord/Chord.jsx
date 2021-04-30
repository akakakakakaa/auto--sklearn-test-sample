import React from "react";
import { ResponsiveChord } from "@nivo/chord";
import { TableTooltip, BasicTooltip, Chip } from "@nivo/tooltip";

const ArcTooltip = ({ arc }) => (
  <TableTooltip
    rows={[
      [
        <Chip key="chip" color={arc.color} />,
        `Custom arc tooltip, ${arc.label}`,
        arc.formattedValue,
      ],
    ]}
  />
);

const RibbonTooltip = ({ ribbon }) => (
  <TableTooltip
    rows={[
      [
        <Chip key="chip" color={ribbon.source.color} />,
        "Actual",
        <strong key="id">{ribbon.source.label}</strong>,
        ribbon.source.value,
      ],
      [
        <Chip key="chip" color={ribbon.target.color} />,
        "Predicted",
        <strong key="id">{ribbon.target.label}</strong>,
        ribbon.target.value,
      ],
    ]}
  />
);

const Chord = ({ matrix, keys }) => (
  <ResponsiveChord
    theme={{
      textColor: "#e0e0e0",
      tooltip: {
        container: {
          background: "#1e2430",
          fontSize: `12px`,
          fontFamily: `GmarketSansMedium`,
        },
      },
    }}
    ribbonTooltip={RibbonTooltip}
    arcTooltip={ArcTooltip}
    matrix={matrix}
    keys={keys}
    margin={{ top: 60, right: 60, bottom: 90, left: 60 }}
    valueFormat=".2f"
    padAngle={0.02}
    innerRadiusRatio={0.96}
    innerRadiusOffset={0.02}
    arcOpacity={1}
    arcBorderWidth={1}
    arcBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
    ribbonOpacity={0.5}
    ribbonBorderWidth={1}
    ribbonBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
    enableLabel={true}
    label="id"
    labelOffset={12}
    labelRotation={-90}
    labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
    colors={{ scheme: "nivo" }}
    isInteractive={true}
    arcHoverOpacity={1}
    arcHoverOthersOpacity={0.25}
    ribbonHoverOpacity={0.75}
    ribbonHoverOthersOpacity={0.25}
    animate={true}
    motionStiffness={90}
    motionDamping={7}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 0,
        translateY: 70,
        itemWidth: 80,
        itemHeight: 14,
        itemsSpacing: 0,
        itemTextColor: "#FFF",
        itemDirection: "left-to-right",
        symbolSize: 12,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#FFF",
            },
          },
        ],
      },
    ]}
  />
);

export default Chord;
