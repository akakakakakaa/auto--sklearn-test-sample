import React from "react";
import "./HyperGlobe.scss";

function getDirection(step: number) {
  if (step === 2) return "reverse";
  else return "normal";
}

function getSize(step: number) {
  if (step === 1) return 250;
  else if (step === 2) return 450;
  else if (step === 3) return 650;
  else return 0;
}

function getColor(step: number) {
  if (step === 1) return "#e0e0e0";
  else if (step === 2) return "#eedba5";
  else if (step === 3) return "#94d6c5";
  else return "";
}

export default function HyperGlobe(props: { step: number }) {
  return (
    <div
      className="hyperglobe"
      style={{
        width: getSize(props.step),
        height: getSize(props.step),
        margin: -getSize(props.step) / 2,
      }}
    >
      {[...Array(21)].map((_) => {
        return (
          <span
            style={{
              opacity: props.step / 5,
              animationDirection: getDirection(props.step),
              border: `1px solid ${getColor(props.step)}`,
            }}
          ></span>
        );
      })}
      {props.step === 3 ? <h3>Start</h3> : null}
    </div>
  );
}
