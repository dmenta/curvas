import { CurveCodec } from "./codec.js";

/**
 *  @typedef {Object} Store
 * @property {function(CurveState): void} save
 * @property {function(): CurveState|null} load
 */
export const UrlStore = {
  /** @param {CurveState} state */
  save(state) {
    const encoded = CurveCodec.encode(state);
    const qs = new URLSearchParams(encoded).toString();
    history.replaceState(null, "", "?" + qs);
  },
  /** @returns {CurveState|null} */
  load() {
    const params = new URLSearchParams(window.location.search);
    if (![...params.keys()].length) return null;

    return CurveCodec.decode(Object.fromEntries(params.entries()));
  },
};
