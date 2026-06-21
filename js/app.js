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

const els = {
  // Sliders h1
  /** @type {HTMLInputElement} */
  h1x: document.getElementById("h1x"),
  /** @type {HTMLInputElement} */
  h1y: document.getElementById("h1y"),
  // Sliders h2
  /** @type {HTMLInputElement} */
  h2x: document.getElementById("h2x"),
  /** @type {HTMLInputElement} */
  h2y: document.getElementById("h2y"),
  // Slider steps
  /** @type {HTMLInputElement} */
  steps: document.getElementById("steps"),

  // Checkboxes
  /** @type {HTMLInputElement} */
  showGrid: document.getElementById("showGrid"),
  /** @type {HTMLInputElement} */
  showCurve: document.getElementById("showCurve"),
  /** @type {HTMLInputElement} */
  showHandles: document.getElementById("showHandles"),
  /** @type {HTMLInputElement} */
  showSegments: document.getElementById("showSegments"),
  /** @type {HTMLInputElement} */
  showPoints: document.getElementById("showPoints"),

  // Botones
  /** @type {HTMLButtonElement} */
  copyCss: document.getElementById("copyCss"),
  /** @type {HTMLButtonElement} */
  copyJson: document.getElementById("copyJson"),

  //SVG
  /** @type {SVGSVGElement} */
  svg: document.getElementById("svg"),
  /** @type {SVGPathElement} */
  realCurve: document.getElementById("realCurve"),
  /** @type {SVGPolylineElement} */
  segments: document.getElementById("segments"),
  /** @type {SVGGElement} */
  points: document.getElementById("points"),
  /** @type {SVGGElement} */
  grid: document.getElementById("grid"),
  /** @type {SVGGElement} */
  controls: document.getElementById("controls"),
  /** @type {SVGUseElement} */
  h1Grip: document.getElementById("h1Grip"),
  /** @type {SVGUseElement} */
  h2Grip: document.getElementById("h2Grip"),
  /** @type {SVGLineElement} */
  h1Line: document.getElementById("h1Line"),
  /** @type {SVGLineElement} */
  h2Line: document.getElementById("h2Line"),
  /** @type {SVGTextElement} */
  h1label: document.getElementById("h1label"),
  /** @type {SVGTextElement} */
  h2label: document.getElementById("h2label"),

  // UI
  /** @type {HTMLDivElement} */
  info: document.getElementById("info"),
  /** @type {HTMLDivElement} */
  tip: document.getElementById("tip"),
  /** @type {HTMLSelectElement} */
  theme: document.getElementById("theme"),
  /** @type {HTMLMetaElement} */
  colorScheme: document.getElementById("colorScheme"),
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
 *   @param {CurveState} next
 *   @param {CurveState} prev
 */
function updateUI(next) {
  updateControls(next);
  updateDraw(next);
}

/**  @param {CurveState} next */
function updateDraw(next) {
  draw(next);
}

/**
 *   @param {CurveState} next
 *   @param {CurveState} prev
 */
function updateControls(next) {
  els.h1x.value = next.h1.x;
  els.h1y.value = next.h1.y;
  els.h2x.value = next.h2.x;
  els.h2y.value = next.h2.y;
  els.steps.value = next.steps;
}

/**
 *  @typedef {Object} Codec
 * @property {function(CurveState): Object} encode
 * @property {function(Object): CurveState} decode
 */
const CurveCodec = {
  /**
   *  @param {CurveState} state
   *  @returns {StateMessage}
   */
  encode(state) {
    return {
      h1x: state.h1.x,
      h1y: state.h1.y,
      h2x: state.h2.x,
      h2y: state.h2.y,
      steps: state.steps,
    };
  },

  /**
   * @param {StateMessage} params
   * @returns {CurveState}
   */
  decode(params) {
    return {
      h1: { x: +params.h1x, y: +params.h1y },
      h2: { x: +params.h2x, y: +params.h2y },
      steps: +params.steps || 20,
    };
  },
};

/**
 *  @typedef {Object} Store
 * @property {function(CurveState): void} save
 * @property {function(): CurveState|null} load
 */
const UrlStore = {
  /** @param {CurveState} state */
  save(state) {
    const encoded = CurveCodec.encode(state);
    const qs = new URLSearchParams(encoded).toString();
    history.replaceState(null, "", "?" + qs);
  },
  /** @returns {CurveState|null} */
  load() {
    const params = new URLSearchParams(window.location.search);
    if (![...params.keys()].length) return null;

    return CurveCodec.decode(Object.fromEntries(params.entries()));
  },
};

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
    updateModel({ ...model, h1: { ...model.h1, x: +els.h1x.value } });
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
    if (e.key === "Shift") state.shiftPressed = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") state.shiftPressed = false;
  });
}

function addPointerEvents() {
  window.addEventListener("pointermove", (e) => {
    if (!state.drag) return;

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

(function initFromUrl() {
  const loaded = UrlStore.load() ?? model;

  updateModel(loaded);
})();
