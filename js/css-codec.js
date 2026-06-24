/**
 *  @typedef {Object} Codec
 * @property {function(CurveState): Object} encode
 * @property {function(Object): CurveState} decode
 */

export const CurveCssCodec = {
  /**
   *  @param {CurveState} state
   *  @returns {string}
   */
  encode(state) {
    return `cubic-bezier(${(state.h1.x / 100).toFixed(2)}, ${(state.h1.y / 100).toFixed(2)}, ${(state.h2.x / 100).toFixed(2)}, ${(state.h2.y / 100).toFixed(2)})`;
  },

  /**
   * @param {string} params
   * @returns {CurveState}
   */
  decode(params) {
    return {
      h1: { x: +params.slice(13, 17) * 100, y: +params.slice(19, 23) * 100 },
      h2: { x: +params.slice(25, 29) * 100, y: +params.slice(31, 35) * 100 },
    };
  },
};
