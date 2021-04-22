import React, { useEffect } from "react";
import "./Eye.scss";

export default function Eye() {
  useEffect(addMouseEvent, []);
  return (
    <div className="circle-wrap right">
      <div className="circle eye-wrap">
        <div className="eye">
          <div className="eye-orange-wrap">
            <div className="eye-orange"></div>
            <div className="eye-white"></div>
          </div>
          <div className="eye-black"></div>
        </div>
      </div>
    </div>
  );
}

function addMouseEvent() {
  const TRANSFORM_RATIO = 20;
  const MAX_DISTANCE_VALUE = 1.25;
  const BASE_EYE_ORANGE_VW = 1.45;
  const BASE_EYE_BLACK_VW = 2.65;
  const eyeOrange = document.querySelector<HTMLElement>(".eye-orange-wrap");
  const eyeBlack = document.querySelector<HTMLElement>(".eye-black");

  window.addEventListener("mousemove", (e: Event) => handleMove(e));
  window.addEventListener("touchmove", (e: Event) => handleMove(e));

  function handleMove(e: React.TouchEvent | React.MouseEvent | Event) {
    const clientSize = { x: 0, y: 0 };
    if (e instanceof TouchEvent) {
      clientSize.x = e.touches[0].clientX;
      clientSize.y = e.touches[0].clientY;
    } else if (e instanceof MouseEvent) {
      clientSize.x = e.clientX;
      clientSize.y = e.clientY;
    } else {
      return;
    }
    const { top, left, width, height } = eyeOrange!.getBoundingClientRect();
    const diffX = (clientSize.x - left - width / 2) / TRANSFORM_RATIO;
    const diffY = (clientSize.y - top - height / 2) / TRANSFORM_RATIO;
    const diff = Math.sqrt(diffX * diffX + diffY * diffY);
    const distance = Math.min(diff, MAX_DISTANCE_VALUE);
    const rate = distance / diff;
    let leftValue = Math.sqrt(
      distance * distance - diffY * rate * diffY * rate
    );
    let topValue = Math.sqrt(distance * distance - diffX * rate * diffX * rate);
    leftValue = diffX > 0 ? leftValue : -leftValue;
    topValue = diffY > 0 ? topValue : -topValue;
    eyeOrange!.style.left = `${leftValue + BASE_EYE_ORANGE_VW}em`;
    eyeOrange!.style.top = `${topValue + BASE_EYE_ORANGE_VW}em`;
    eyeBlack!.style.left = `${leftValue * 1.6 + BASE_EYE_BLACK_VW}em`;
    eyeBlack!.style.top = `${topValue * 1.6 + BASE_EYE_BLACK_VW}em`;
  }
}
