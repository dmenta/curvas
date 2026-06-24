import { CurveCssCodec } from "./css-codec.js";
import { bezierPoints } from "./bezier.js";
import { els } from "./elements.js";

const replayAnimations = () => {
  document.getAnimations().forEach((anim) => {
    anim.cancel();
    anim.play();
  });
};

/** @param {CurveState} state */
export function animar(state) {
  const css = CurveCssCodec.encode(state);
  const points = bezierPoints(state);
  els.regla.innerHTML = "";
  points.forEach((punto, i) => {
    const div = document.createElement("div");
    div.className = "reglaPunto";
    if (i === 10) {
      div.classList.add("reglaPuntoCentral");
    }
    div.style.top = `calc(${punto.y.toPrecision(5)} * var(--canvas-size))`;
    els.regla.appendChild(div);
  });

  els.animadorBola.style.animationTimingFunction = css;

  replayAnimations();
}
