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
 * @param {Point} h1
 * @param {Point} h2
 * @param {number} steps
 * @returns {Point[]}
 */
function bezierPoints(h1, h2, steps) {
    let pts = [];
    for (let t = 0; t <= steps; t++) {
        let tn = t / steps,
            ti = (steps - t) / steps;
        let f1 = 3 * ti * ti * tn;
        let f2 = 3 * ti * tn * tn;
        let f3 = tn * tn * tn;
        pts.push({
            x: round(f1 * h1.x + f2 * h2.x + f3 * 100),
            y: round(f1 * h1.y + f2 * h2.y + f3 * 100),
        });
    }
    return pts;
}
