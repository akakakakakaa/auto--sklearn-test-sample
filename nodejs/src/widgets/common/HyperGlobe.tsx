import React from "react";
import "./HyperGlobe.scss";
import { Typography } from "@material-ui/core";

function getDirection(step: number) {
  if (step === 2) return "reverse";
  else return "normal";
}

function getSize(step: number) {
  if (step === 1) return 14;
  else if (step === 2) return 25;
  else if (step === 3) return 33;
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
    <>
      <div
        className="hyperglobe"
        style={{
          width: `${getSize(props.step)}vw`,
          height: `${getSize(props.step)}vw`,
          margin: `${-getSize(props.step) / 2}vw`,
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
      </div>
      {props.step === 3 ? (
        <Typography
          className="start"
          variant="h1"
          display="inline"
          style={{
            position: "absolute",
            top: "50%",
            left: "77%",
            transform: "translate(-50%, -50%)",
            color: "rgb(238, 198, 94)",
            fontFamily: "LAB디지털",
            /*width: "100%",*/
            textAlign: "center",
          }}
        >
          S T A R T
        </Typography>
      ) : null}
    </>
  );
}
