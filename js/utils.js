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
  return sonPointsIguales(a.h1, b.h1) && sonPointsIguales(a.h2, b.h2);
}

/**
 *
 * @param {Point|undefined} a
 * @param {Point|undefined} b
 * @returns {boolean}
 */
export function sonPointsIguales(a, b) {
  if (!a || !b) {
    return false;
  }
  return a.x === b.x && a.y === b.y;
}

/**
 * @param {number} v
 * @returns {number}
 */
export function round(v) {
  return Math.round(v * 5) / 5;
}

export function debounce(callback, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
}
