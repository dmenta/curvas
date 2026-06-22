import "./utils.js";

export const UndoStack = {
  /**
   * @type {CurveState[]}
   * @description Stack de estados previos. El último elemento es el estado actual.
   */
  past: [],
  /** @type {CurveState[]} */
  future: [],

  /** @param {CurveState} estado */
  push(estado) {
    const current = this.past.peek();
    if (current && sonEstadosIguales(current, estado)) {
      return;
    }

    this.past.push(estado);
    this.future = [];
  },

  /** @returns {CurveState|null} */
  undo() {
    if (this.past.length < 2) {
      return null;
    }

    const pastEstado = this.past.pop();

    if (!sonEstadosIguales(this.future.peek(), pastEstado)) {
      this.future.push(pastEstado);
    }

    return this.past.peek();
  },

  /** @returns {CurveState|null} */
  redo() {
    const futureEstado = this.future.pop();
    if (futureEstado === undefined) {
      return null;
    }

    if (!sonEstadosIguales(this.past.peek(), futureEstado)) {
      this.past.push(futureEstado);
    }

    return futureEstado;
  },
};

/**
 *
 * @param {CurveState|undefined} a
 * @param {CurveState|undefined} b
 * @returns {boolean}
 */
function sonEstadosIguales(a, b) {
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
