import { curvaEls, els } from "./elements.js";
import { model, updateModel } from "./model.js";
import { Estado } from "./estado.js";
import { applyTheme } from "./theme.js";
import { round, debounce } from "./utils.js";
import { copyWithFeedback } from "./ui.js";
import { UndoStack } from "./undo.js";
import { guardarCurva } from "./library.js";

/**
 * @typedef {Object} State
 * @property {string|null} drag
 * @property {boolean} shiftPressed
 */
const state = {
  drag: null,
  shiftPressed: false,
};

export function addEventListeners() {
  addSlidersEvents();
  addPanelControlsEvents();
  addHandlersEvents();
  addKeyboardEvents();
  addPointerEvents();
  addCopyEvents();
  addLibraryEvents();
}

function addSlidersEvents() {
  curvaEls.h1x.addEventListener("input", () =>
    updateModel({ ...model, h1: { ...model.h1, x: +curvaEls.h1x.value } }),
  );
  curvaEls.h1y.addEventListener("input", () =>
    updateModel({ ...model, h1: { ...model.h1, y: +curvaEls.h1y.value } }),
  );
  curvaEls.h2x.addEventListener("input", () =>
    updateModel({ ...model, h2: { ...model.h2, x: +curvaEls.h2x.value } }),
  );
  curvaEls.h2y.addEventListener("input", () =>
    updateModel({ ...model, h2: { ...model.h2, y: +curvaEls.h2y.value } }),
  );
}

function addPanelControlsEvents() {
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
        Estado.apply(prev);
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      const next = UndoStack.redo();
      if (next) {
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
  });

  window.addEventListener("pointerup", () => {
    if (!state.drag) {
      return;
    }

    state.drag = null;
    Estado.save(model);
  });

  [curvaEls.h1x, curvaEls.h1y, curvaEls.h2x, curvaEls.h2y].forEach((el) =>
    el.addEventListener(
      "change",
      debounce(() => Estado.save(model), 100),
    ),
  );
}

function addCopyEvents() {
  els.copyCss.onclick = () => {
    const s = model;
    copyWithFeedback(
      els.copyCss,
      `cubic-bezier(${(s.h1.x / 100).toFixed(2)}, ${(s.h1.y / 100).toFixed(2)}, ${(s.h2.x / 100).toFixed(2)}, ${(s.h2.y / 100).toFixed(2)})`,
    );
  };
}

function addLibraryEvents() {
  els.curvas.addEventListener("change", () => {
    const next = JSON.parse(els.curvas.value);
    Estado.apply(next);
    els.curvas.value = "";
  });

  els.guardarCurva.addEventListener("click", () => {
    const nombre = els.curvaNombre.value.trim();
    if (!nombre) {
      return;
    }

    guardarCurva(nombre, model);
    els.curvaNombre.value = "";
  });
}

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
