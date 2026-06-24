/**
 * @param {CurveState} state
 * @param {number} steps
 * @return {Point[]}
 */
export function bezierPoints(state, steps = 20) {
  const P = [
    { x: 0, y: 0 },
    { x: state.h1.x / 100, y: state.h1.y / 100 },
    { x: state.h2.x / 100, y: state.h2.y / 100 },
    { x: 1, y: 1 },
  ];
  function bezier(t) {
    const mt = 1 - t;
    const b0 = mt * mt * mt;
    const b1 = 3 * mt * mt * t;
    const b2 = 3 * mt * t * t;
    const b3 = t * t * t;
    return {
      x: b0 * P[0].x + b1 * P[1].x + b2 * P[2].x + b3 * P[3].x,
      y: b0 * P[0].y + b1 * P[1].y + b2 * P[2].y + b3 * P[3].y,
    };
  }

  function yAtX(targetX) {
    if (targetX <= 0) return 0;
    if (targetX >= 1) return 1;
    let lo = 0,
      hi = 1;
    for (let i = 0; i < 52; i++) {
      const mid = (lo + hi) / 2;
      const cx = bezier(mid).x;
      if (Math.abs(cx - targetX) < 1e-12) return bezier(mid).y;
      cx < targetX ? (lo = mid) : (hi = mid);
    }
    return bezier((lo + hi) / 2).y;
  }

  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = i / steps;
    return { step: i, y: yAtX(x) };
  });
}
