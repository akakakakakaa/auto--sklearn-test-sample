import React, { useEffect, useState } from "react";
import Chord from "./Chord";
import ChordData from "./ChordData.json";

export default function ConfusionChord() {
  return (
    <div style={{ width: "inherit", height: "inherit" }} id="chord-chart">
      <Chord
        matrix={ChordData}
        keys={["John", "Raoul", "Jane", "Marcel", "Ibrahim"]}
      />
    </div>
  );
}
