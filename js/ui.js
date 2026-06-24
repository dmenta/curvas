import { els } from "./elements.js";
import { round } from "./utils.js";

/**  @type {number}     */
const gridSize = 100;

/** @param {CurveState} state */
export function draw(state) {
  updateRealCurve(state);

  updateHandler(els.h1Grip, els.h1Line, state.h1);
  updateHandler(els.h2Grip, els.h2Line, state.h2);

  updateHandlerLabel(els.h1label, state.h1, "H1");
  updateHandlerLabel(els.h2label, state.h2, "H2");

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
  const limiteX = (tag === "H1" ? 0.82 : 0.18) * gridSize;
  const limiteY = (tag === "H1" ? 0.97 : 0.03) * gridSize;

  const anchor = pos.x < limiteX ? "start" : "end";
  const horizontalOffset = anchor === "start" ? 2 : -2;
  const verticalOffset = pos.y < limiteY ? -1.2 : 1.7;

  elem.setAttribute("text-anchor", anchor);
  elem.setAttribute("x", round(pos.x) + horizontalOffset);
  elem.setAttribute("y", gridSize - round(pos.y) + verticalOffset);
  elem.textContent = `X: ${round(pos.x).toFixed(1)}, Y: ${round(pos.y).toFixed(1)}`;
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

  els.info.innerHTML = `
    <b>Control inicial:</b> (${state.h1.x.toFixed(2)}, ${state.h1.y.toFixed(2)})<br>
    <b>Control final:</b> (${state.h2.x.toFixed(2)}, ${state.h2.y.toFixed(2)})<br>
    <b>CSS:</b> cubic-bezier(${(state.h1.x / 100).toFixed(2)}, ${(state.h1.y / 100).toFixed(2)}, ${(state.h2.x / 100).toFixed(2)}, ${(state.h2.y / 100).toFixed(2)})
    `;
}

/**
 *  @param {HTMLButtonElement} button
 *  @param {string} text
 */
export async function copyWithFeedback(button, text) {
  await navigator.clipboard.writeText(text);
  const original = button.textContent;

  button.textContent = "Copiado";
  button.classList.add("copied");

  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("copied");
  }, 1200);
}
