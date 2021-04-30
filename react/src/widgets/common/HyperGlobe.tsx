import React, { useState } from "react";
import "./HyperGlobe.scss";
import { Typography, Link } from "@material-ui/core";
import Countdown from "react-countdown";
import Animated from "react-mount-animation";

function getDirection(step: number) {
  if (step === 2) return "reverse";
  else return "normal";
}

function getSize(step: number) {
  if (step === 1) return 11;
  else if (step === 2) return 22;
  else if (step === 3) return 31;
  else return 0;
}

function getColor(step: number) {
  if (step === 1) return "#e0e0e0";
  else if (step === 2) return "#eedba5";
  else if (step === 3) return "#94d6c5";
  else return "";
}

export default function HyperGlobe(props: {
  step: number;
  setIsTraining?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isStart, setStart] = useState(false);
  return (
    <>
      <div
        className="hyperglobe"
        style={{
          width: `${getSize(props.step)}vw`,
          height: `${getSize(props.step)}vw`,
          margin: `${-getSize(props.step) / 2}vw`,
          animation: isStart
            ? `rotate 30s linear infinite`
            : `rotate 60s linear infinite`,
        }}
      >
        {[...Array(21)].map((_, index) => {
          return (
            <span
              style={{
                opacity: props.step / 5,
                animationDirection: getDirection(props.step),
                border: `1px solid ${getColor(props.step)}`,
                animation: isStart
                  ? `globe ${0.5 * index}s linear infinite`
                  : `globe ${index}s linear infinite`,
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
          <Animated.div
            show={!isStart}
            unmountAnim={` 
            0% {opacity: 1}
            100% {opacity: 0}
        `} /*10% { transform: translate3d(0,20vh,0); }*/
          >
            <Link
              href="#"
              color="inherit"
              onClick={() => {
                setStart(true);
                props.setIsTraining!(true);
              }}
            >
              S T A R T
            </Link>
          </Animated.div>

          <Animated.div
            show={isStart}
            delay={1.4}
            mountAnim={` 
            0% {opacity: 0}
            100% {opacity: 1}
        `}
          >
            <Countdown date={Date.now() + 10000}>
              <span>D O N E</span>
            </Countdown>
          </Animated.div>
        </Typography>
      ) : null}
    </>
  );
}
