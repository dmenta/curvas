import { UrlStore } from "./url-store.js";
import { UndoStack } from "./undo.js";

export const Estado = {
  /** @param {CurveState} state */
  save(state) {
    estadoListeners.forEach((listener) => listener(state));
  },
};

/** @type {Array<function(CurveState): void>} */
const estadoListeners = [
  (state) => UrlStore.save(state),
  (state) => UndoStack.push(state),
];
