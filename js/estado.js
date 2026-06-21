const Estado = {
  /** @param {CurveState} state */
  save(state) {
    estadoListeners.forEach((listener) => listener(state));
  },
};

/** @type {Array<function(CurveState): void>} */
const estadoListeners = [(state) => UrlStore.save(state)];
