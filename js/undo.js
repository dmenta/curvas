import { peek, sonEstadosIguales } from "./utils.js";

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
    if (peek(this.past) && sonEstadosIguales(peek(this.past), estado)) return;
    this.past.push(estado);
    this.future = [];
  },

  /** @returns {CurveState|null} */
  undo() {
    if (this.past.length < 2) return null;
    const pastEstado = this.past.pop();
    if (!sonEstadosIguales(peek(this.future), pastEstado)) {
      this.future.push(pastEstado);
    }
    return peek(this.past);
  },

  /** @returns {CurveState|null} */
  redo() {
    const futureEstado = this.future.pop();
    if (futureEstado === undefined) return null;
    if (!sonEstadosIguales(peek(this.past), futureEstado)) {
      this.past.push(futureEstado);
    }
    return futureEstado;
  },
};
