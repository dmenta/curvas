import { els } from "./elements.js";
import { bezierPoints, round } from "./bezier.js";

/**  @type {number}     */
const gridSize = 100;

/**  @type {number}     */
const desplazamientoLabel = 1.5;

/** @param {CurveState} state */
export function draw(state) {
  updateRealCurve(state);

  updateHandler(els.h1Grip, els.h1Line, state.h1);
  updateHandler(els.h2Grip, els.h2Line, state.h2);

  updateHandlerLabel(els.h1label, state.h1, "H1");
  updateHandlerLabel(els.h2label, state.h2, "H2");

  drawSegments(state);
  drawPoints(state);

  updateInfo(state);
}

/** @param {CurveState} state */
function updateRealCurve(state) {
  els.realCurve.setAttribute(
    "d",
    `M 0 100 C ${state.h1.x} ${100 - state.h1.y}, ${state.h2.x} ${100 - state.h2.y}, 100 0`,
  );
}

/**
 * @param {SVGTextElement} elem
 * @param {Point} pos
 * @param {string} tag
 */
function updateHandlerLabel(elem, pos, tag) {
  elem.setAttribute("x", pos.x + desplazamientoLabel);
  elem.setAttribute("y", gridSize - pos.y - desplazamientoLabel);
  elem.textContent = `${tag} (${round(pos.x)},${round(pos.y)})`;
}

/**
 * @param {SVGUseElement} gripElem
 * @param {SVGLineElement} lineElem
 * @param {Point} pos
 */
function updateHandler(gripElem, lineElem, pos) {
  gripElem.setAttribute("x", pos.x);
  gripElem.setAttribute("y", gridSize - pos.y);
  lineElem.setAttribute("x2", pos.x);
  lineElem.setAttribute("y2", gridSize - pos.y);
}

/**  @param {CurveState} state */
function updateInfo(state) {
  if (els.info.classList.contains("hidden")) {
    return;
  }

  const pointsInfo =
    els.showSegments.checked || els.showPoints.checked
      ? `<b>Puntos generados:</b> ${bezierPoints(state).length}<br>`
      : "";

  els.info.innerHTML = `
    ${pointsInfo}  
    <b>Control inicial:</b> (${state.h1.x.toFixed(2)}, ${state.h1.y.toFixed(2)})<br>
    <b>Control final:</b> (${state.h2.x.toFixed(2)}, ${state.h2.y.toFixed(2)})<br>
    <b>CSS:</b> cubic-bezier(${(state.h1.x / 100).toFixed(2)}, ${(state.h1.y / 100).toFixed(2)}, ${(state.h2.x / 100).toFixed(2)}, ${(state.h2.y / 100).toFixed(2)})
    `;
}

/**  @param {CurveState} state */
function drawSegments(state) {
  if (!els.showSegments.checked) {
    els.segments.classList.add("hidden");
    return;
  }

  els.segments.setAttribute(
    "points",
    bezierPoints(state)
      .map((p) => `${p.x.toFixed(2)},${(100 - p.y).toFixed(2)}`)
      .join(" "),
  );
  els.segments.classList.remove("hidden");
}

/**  @param {CurveState} state */
function drawPoints(state) {
  if (!els.showPoints.checked) {
    els.points.classList.add("hidden");
    return;
  }

  const elemCount = els.points.children.length;
  const dataPoints = bezierPoints(state);

  dataPoints.map((p, i) => {
    const values = { x: p.x.toFixed(2), y: (gridSize - p.y).toFixed(2) };

    if (i < elemCount) {
      /** @type {SVGCircleElement} */
      const circle = els.points.children[i];
      circle.setAttribute("cx", values.x);
      circle.setAttribute("cy", values.y);
      circle.classList.remove("hidden");
    } else {
      /** @type {SVGCircleElement} */
      const el = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      el.setAttribute("cx", values.x);
      el.setAttribute("cy", values.y);
      el.setAttribute("r", 0.55);
      els.points.appendChild(el);
    }
  });

  if (elemCount > dataPoints.length) {
    for (let i = dataPoints.length; i < elemCount; i++) {
      els.points.children[i].classList.add("hidden");
    }
  }

  els.points.classList.remove("hidden");
}

/**
 *  @param {HTMLButtonElement} button
 *  @param {string} text
 */
export async function copyWithFeedback(button, text) {
  await navigator.clipboard.writeText(text);
  const original = button.textContent;

  button.textContent = "✓ Copiado";
  button.classList.add("copied");

  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("copied");
  }, 1200);
}
