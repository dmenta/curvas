import { draw } from "./ui.js";
import { els } from "./elements.js";

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} CurveState
 * @property {Point} h1
 * @property {Point} h2
 * @property {number} steps
 */

/** @type {CurveState} */
export let model = {
  h1: { x: 30, y: 90 },
  h2: { x: 60, y: 20 },
  steps: 20,
};

/** @type {Array<function(CurveState, CurveState): void>} */
const modelListeners = [updateUI];

/** @param {CurveState} next */
export function updateModel(next) {
  const prev = model;
  model = next;
  modelListeners.forEach((listener) => listener(model, prev));
}

function updateUI(next, prev) {
  updateControls(next, prev);
  updateDraw(next);
}

function updateControls(next, prev) {
  if (next.h1.x !== prev.h1.x) els.h1x.value = next.h1.x;
  if (next.h1.y !== prev.h1.y) els.h1y.value = next.h1.y;
  if (next.h2.x !== prev.h2.x) els.h2x.value = next.h2.x;
  if (next.h2.y !== prev.h2.y) els.h2y.value = next.h2.y;
  if (next.steps !== prev.steps) els.steps.value = next.steps;
}

export function updateDraw(next) {
  draw(next);
}
