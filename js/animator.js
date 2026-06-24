import { CurveCssCodec } from "./css-codec.js";
import { els } from "./elements.js";

const replayAnimations = () => {
  document.getAnimations().forEach((anim) => {
    anim.cancel();
    anim.play();
  });
};

/** @param {CurveState} state */
export function animacionTiming(state) {
  const css = CurveCssCodec.encode(state);
  els.animadorBola.style.animationTimingFunction = css;

  replayAnimations();
}
