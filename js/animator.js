import { CurveCssCodec } from "./css-codec.js";
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
  els.animadorBola.style.setProperty("--curva-timing", css);

  replayAnimations();
}
