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
 * @param {Handlers} handlers
 * @param {number} steps
 * @returns {Point[]}
 */
function bezierPoints(handlers, steps) {
    let pts = [];
    for (let t = 0; t <= steps; t++) {
        let tn = t / steps,
            ti = (steps - t) / steps;
        let f1 = 3 * ti * ti * tn;
        let f2 = 3 * ti * tn * tn;
        let f3 = tn * tn * tn;
        pts.push({
            x: round(f1 * handlers.h1.x + f2 * handlers.h2.x + f3 * 100),
            y: round(f1 * handlers.h1.y + f2 * handlers.h2.y + f3 * 100),
        });
    }
    return pts;
}
