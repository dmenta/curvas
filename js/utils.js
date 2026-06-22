/**
 * @template T
 * @param {T[]|null|undefined} arr
 * @returns {T|undefined}
 */
export const peek = (arr) => arr?.at(-1);

/**
 *
 * @param {CurveState|undefined} a
 * @param {CurveState|undefined} b
 * @returns {boolean}
 */
export function sonEstadosIguales(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.h1.x === b.h1.x &&
    a.h1.y === b.h1.y &&
    a.h2.x === b.h2.x &&
    a.h2.y === b.h2.y &&
    a.steps === b.steps
  );
}

/**
 * @param {number} v
 * @returns {number}
 */
export function round(v) {
  return Math.round(v * 100) / 100;
}
