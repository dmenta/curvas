import { els } from "./elements.js";
import { bezierPoints, round } from "./bezier.js";
import { UrlStore } from "./url-store.js";
import { applyTheme } from "./theme.js";
import { draw } from "./ui.js";
import { Estado } from "./estado.js";
import { UndoStack } from "./undo.js";

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

/**
 * @typedef {Object} StateMessage
 * @property {number} h1x
 * @property {number} h1y
 * @property {number} h2x
 * @property {number} h2y
 * @property {number} steps
 */

/**
 * @typedef {Object} State
 * @property {string|null} drag
 * @property {boolean} shiftPressed
 */
const state = {
  drag: null,
  shiftPressed: false,
};

/** @type {CurveState} */
let model = {
  h1: { x: 30, y: 90 },
  h2: { x: 60, y: 20 },
  steps: 20,
};

/** @type {Array<function(CurveState, CurveState): void>} */
const modelListeners = [updateUI];

/**
 * @param {CurveState} next
 */
function updateModel(next) {
  const prev = model;
  model = next;
  modelListeners.forEach((listener) => listener(model, prev));
}

/**
 * @param {CurveState} next
 * @param {CurveState} prev
 */
function updateUI(next, prev) {
  updateControls(next, prev);
  updateDraw(next);
}

/**
 * @param {CurveState} next
 * @param {CurveState} prev
 */
function updateControls(next, prev) {
  if (next.h1.x !== prev.h1.x) els.h1x.value = next.h1.x;
  if (next.h1.y !== prev.h1.y) els.h1y.value = next.h1.y;
  if (next.h2.x !== prev.h2.x) els.h2x.value = next.h2.x;
  if (next.h2.y !== prev.h2.y) els.h2y.value = next.h2.y;
  if (next.steps !== prev.steps) els.steps.value = next.steps;
}

/** @param {CurveState} next */
function updateDraw(next) {
  draw(next);
}

/**
 * @param {PointerEvent} e
 * @returns {Point}
 */
function svgPos(e) {
  let pt = els.svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  let p = pt.matrixTransform(els.svg.getScreenCTM().inverse());

  let x = Math.max(0, Math.min(100, p.x));
  let y = Math.max(0, Math.min(100, 100 - p.y));

  if (state.shiftPressed) {
    x = Math.round(x / 5) * 5;
    y = Math.round(y / 5) * 5;
  }

  return { x, y };
}

function addEventListeners() {
  addSlidersEvents();
  addPanelControlsEvents();
  addHandlersEvents();
  addKeyboardEvents();
  addPointerEvents();
  addCopyEvents();
}

function addSlidersEvents() {
  els.steps.addEventListener("input", () =>
    updateModel({ ...model, steps: +els.steps.value }),
  );

  els.h1x.addEventListener("input", () =>
    updateModel({ ...model, h1: { ...model.h1, x: +els.h1x.value } }),
  );
  els.h1y.addEventListener("input", () =>
    updateModel({ ...model, h1: { ...model.h1, y: +els.h1y.value } }),
  );
  els.h2x.addEventListener("input", () =>
    updateModel({ ...model, h2: { ...model.h2, x: +els.h2x.value } }),
  );
  els.h2y.addEventListener("input", () =>
    updateModel({ ...model, h2: { ...model.h2, y: +els.h2y.value } }),
  );
}

function addPanelControlsEvents() {
  [els.showPoints, els.showSegments].forEach((x) =>
    x.addEventListener("input", () => updateModel(model)),
  );

  els.showGrid.addEventListener("input", (e) => {
    els.grid.style.display = e.target.checked ? "" : "none";
  });

  els.showHandles.addEventListener("input", (e) => {
    els.h1Line.style.display = e.target.checked ? "" : "none";
    els.h2Line.style.display = e.target.checked ? "" : "none";
  });

  els.showCurve.addEventListener("input", (e) => {
    els.realCurve.style.display = e.target.checked ? "" : "none";
  });

  els.theme.addEventListener("input", () => applyTheme(els.theme.value));
}

function addHandlersEvents() {
  [els.h1Grip, els.h2Grip].forEach((el) =>
    el.addEventListener("pointerdown", () => (state.drag = el.id)),
  );

  els.h1Grip.addEventListener("dblclick", () =>
    updateModel({ ...model, h1: { x: 0, y: 30 } }),
  );

  els.h2Grip.addEventListener("dblclick", () =>
    updateModel({ ...model, h2: { x: 100, y: 30 } }),
  );
}

function addKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
      state.shiftPressed = true;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      const prev = UndoStack.undo();
      if (prev) {
        updateModel(prev);
        Estado.apply(prev);
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      const next = UndoStack.redo();
      if (next) {
        updateModel(next);
        Estado.apply(next);
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
      state.shiftPressed = false;
    }
  });
}

function addPointerEvents() {
  window.addEventListener("pointermove", (e) => {
    if (!state.drag) {
      return;
    }

    const p = svgPos(e);
    const key = state.drag === "h1Grip" ? "h1" : "h2";

    updateModel({
      ...model,
      [key]: { x: round(p.x), y: round(p.y) },
    });

    // tip es UI pura, no toca model, está bien acá
    els.tip.style.display = "block";
    els.tip.style.left = e.clientX + 12 + "px";
    els.tip.style.top = e.clientY + 12 + "px";
    els.tip.textContent = `${state.drag.toUpperCase()} (${round(p.x)}, ${round(p.y)})`;
  });

  // pointerup
  window.addEventListener("pointerup", () => {
    if (!state.drag) {
      return;
    }

    state.drag = null;
    els.tip.style.display = "none";
    Estado.save(model); // ← acá
  });

  // sliders — en change, no en input
  els.h1x.addEventListener("change", () => Estado.save(model));
  els.h1y.addEventListener("change", () => Estado.save(model));
  els.h2x.addEventListener("change", () => Estado.save(model));
  els.h2y.addEventListener("change", () => Estado.save(model));
  els.steps.addEventListener("change", () => Estado.save(model));
}

function addCopyEvents() {
  els.copyJson.onclick = () =>
    copyWithFeedback(
      els.copyJson,
      JSON.stringify(bezierPoints(model), null, 2),
    );

  els.copyCss.onclick = () => {
    const s = model;
    copyWithFeedback(
      els.copyCss,
      `cubic-bezier(${(s.h1.x / 100).toFixed(2)}, ${(s.h1.y / 100).toFixed(2)}, ${(s.h2.x / 100).toFixed(2)}, ${(s.h2.y / 100).toFixed(2)})`,
    );
  };
}

addEventListeners();
applyTheme(els.theme.value);

(function init() {
  const loaded = UrlStore.load() ?? model;
  updateModel(loaded);
  Estado.apply(loaded);
})();
