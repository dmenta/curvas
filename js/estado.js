import { UrlStore } from "./url-store.js";
import { UndoStack } from "./undo.js";
import { updateModel } from "./model.js";
import { animacionTiming } from "./animator.js";
import { ajustarRegla } from "./regla.js";

export const Estado = {
  /** @param {CurveState} state */
  save(state) {
    saveListeners.forEach((listener) => listener(state));
  },

  /** @param {CurveState} state */
  apply(state) {
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
