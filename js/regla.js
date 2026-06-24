import { bezierPoints } from "./bezier.js";
import { els } from "./elements.js";

const MARCAS_COUNT = 21;

/** @param {CurveState} state */
export function ajustarRegla(state) {
  const points = bezierPoints(state);
  const variables = points.map((punto, i) => {
    return `--marca-${i + 1}-pos: ${punto.y.toPrecision(4)};`;
  });
  els.regla.style.cssText = variables.join("\n");
}

export function initMarcasRegla() {
  for (let i = 1; i <= MARCAS_COUNT; i++) {
    const div = document.createElement("div");
    div.className = "reglaPunto";
    if (i === 11) {
      div.classList.add("reglaPuntoCentral");
    }
    div.style.top = `calc(var(--marca-${i}-pos) * var(--canvas-size))`;
    els.regla.appendChild(div);
  }
}
