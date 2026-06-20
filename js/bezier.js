/**
 * @typedef {Object} Handlers
 * @property {Point} h1
 * @property {Point} h2
 */

/**
 *
 * @param {number} v
 * @returns {number}
 */
function round(v) {
    return Math.round(v * 100) / 100;
}

/**
 *
 * @param {CurveState} curveState
 * @returns {Point[]}
 */
function bezierPoints(curveState) {
    let pts = [];
    for (let t = 0; t <= curveState.steps; t++) {
        let tn = t / curveState.steps,
            ti = (curveState.steps - t) / curveState.steps;
        let f1 = 3 * ti * ti * tn;
        let f2 = 3 * ti * tn * tn;
        let f3 = tn * tn * tn;
        pts.push({
            x: round(f1 * curveState.h1.x + f2 * curveState.h2.x + f3 * 100),
            y: round(f1 * curveState.h1.y + f2 * curveState.h2.y + f3 * 100),
        });
    }
    return pts;
}
