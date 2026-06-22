import { UrlStore } from "./url-store.js";
import { UndoStack } from "./undo.js";

export const Estado = {
  /** @param {CurveState} state */
  save(state) {
    saveListeners.forEach((listener) => listener(state));
  },

  /** @param {CurveState} state */
  apply(state) {
    applyListeners.forEach((listener) => listener(state));
  },
};

/** @type {Array<function(CurveState): void>} */
const saveListeners = [
  (state) => UrlStore.save(state),
  (state) => UndoStack.push(state),
];

/** @type {Array<function(CurveState): void>} */
const applyListeners = [(state) => UrlStore.save(state)];
