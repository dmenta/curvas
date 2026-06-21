/**
 * @param {number} v
 * @returns {number}
 */
function round(v) {
  return Math.round(v * 100) / 100;
}

/**
 * @param {CurveState} state
 * @returns {Point[]}
 */
function bezierPoints(state) {
  let pts = [];
  for (let t = 0; t <= state.steps; t++) {
    let tn = t / state.steps,
      ti = (state.steps - t) / state.steps;
    let f1 = 3 * ti * ti * tn;
    let f2 = 3 * ti * tn * tn;
    let f3 = tn * tn * tn;
    pts.push({
      x: round(f1 * state.h1.x + f2 * state.h2.x + f3 * 100),
      y: round(f1 * state.h1.y + f2 * state.h2.y + f3 * 100),
    });
  }
  return pts;
}
