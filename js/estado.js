import { UrlStore } from "./url-store.js";
import { UndoStack } from "./undo.js";
import { updateModel } from "./model.js";
import { animacionTiming } from "./animator.js";
import { ajustarRegla } from "./regla.js";
import { sonEstadosIguales } from "./utils.js";

export const Estado = {
  /** @type {CurveState} */
  currentState: null,

  /** @param {CurveState} state */
  save(state) {
    if (!state || sonEstadosIguales(Estado.currentState, state)) {
      return;
    }

    Estado.currentState = state;

    saveListeners.forEach((listener) => listener(state));
  },

  /** @param {CurveState} state */
  apply(state) {
    if (!state || sonEstadosIguales(Estado.currentState, state)) {
      return;
    }

    updateModel(state);
    Estado.save(state);
  },
};

/** @type {Array<function(CurveState): void>} */
const saveListeners = [
  (state) => UrlStore.save(state),
  (state) => UndoStack.push(state),
  (state) => animacionTiming(state),
  (state) => ajustarRegla(state),
];
