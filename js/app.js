/** @type {SVGSVGElement} */
const svg = document.getElementById("svg");
/** @type {HTMLDivElement} */
const tip = document.getElementById("tip");

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

/**  @returns {CurveState} */
function readSnapshot() {
  return {
    h1: { x: +h1x.value, y: +h1y.value },
    h2: { x: +h2x.value, y: +h2y.value },
    steps: +steps.value,
  };
}

/**  @param {CurveState} s */
function writeSnapshot(s) {
  h1x.value = s.h1.x;
  h1y.value = s.h1.y;
  h2x.value = s.h2.x;
  h2y.value = s.h2.y;
  steps.value = s.steps;
}

/**  @param {CurveState} next */
function setState(next) {
  model = next;
  writeSnapshot(model);
  draw(model);
  UrlStore.save(model);
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
  let pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  let p = pt.matrixTransform(svg.getScreenCTM().inverse());

  let x = Math.max(0, Math.min(100, p.x));
  let y = Math.max(0, Math.min(100, 100 - p.y));

  if (state.shiftPressed) {
    x = Math.round(x / 5) * 5;
    y = Math.round(y / 5) * 5;
  }

  return { x, y };
}

function addEventListeners() {
  addPanelControlsEvents();
  addHandlersEvents();
  addKeyboardEvents();
  addPointerEvents();
  addCopyEvents();
}

function addPanelControlsEvents() {
  document
    .querySelectorAll("input[type=range]")
    .forEach((x) =>
      x.addEventListener("input", () => setState(readSnapshot())),
    );

  [showPoints, showSegments].forEach((x) =>
    x.addEventListener("input", () => draw(model)),
  );

  showGrid.addEventListener(
    "input",
    () => (grid.style.display = showGrid.checked ? "" : "none"),
  );

  showHandles.addEventListener("input", () => {
    h1Line.style.display = showHandles.checked ? "" : "none";
    h2Line.style.display = showHandles.checked ? "" : "none";
  });

  showCurve.addEventListener(
    "input",
    () => (realCurve.style.display = showCurve.checked ? "" : "none"),
  );
  theme.addEventListener("input", applyTheme);
}

function addHandlersEvents() {
  [h1Grip, h2Grip].forEach((el) =>
    el.addEventListener("pointerdown", () => (state.drag = el.id)),
  );

  h1Grip.addEventListener("dblclick", () => {
    const s = readSnapshot();
    s.h1.x = 0;
    s.h1.y = 30;
    setState(s);
  });

  h2Grip.addEventListener("dblclick", () => {
    const s = readSnapshot();
    s.h2.x = 100;
    s.h2.y = 30;
    setState(s);
  });
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
    if (!state.drag) {
      return;
    }

    let p = svgPos(e);

    const s = readSnapshot();

    if (state.drag === "h1Grip") {
      s.h1.x = round(p.x);
      s.h1.y = round(p.y);
    } else {
      s.h2.x = round(p.x);
      s.h2.y = round(p.y);
    }

    tip.style.display = "block";
    tip.style.left = e.clientX + 12 + "px";
    tip.style.top = e.clientY + 12 + "px";
    tip.textContent = `${state.drag.toUpperCase()} (${round(p.x)}, ${round(p.y)})`;

    setState(s);
  });

  window.addEventListener("pointerup", () => {
    state.drag = null;
    tip.style.display = "none";
  });
}

function addCopyEvents() {
  copyJson.onclick = () =>
    copyWithFeedback(copyJson, JSON.stringify(bezierPoints(model), null, 2));

  copyCss.onclick = () => {
    const s = model;
    copyWithFeedback(
      copyCss,
      `cubic-bezier(${(s.h1.x / 100).toFixed(2)}, ${(s.h1.y / 100).toFixed(2)}, ${(s.h2.x / 100).toFixed(2)}, ${(s.h2.y / 100).toFixed(2)})`,
    );
  };
}

addEventListeners();
applyTheme();

(function initFromUrl() {
  const loaded = UrlStore.load();
  if (!loaded) return;

  setState(loaded);
})();
