/**
 *  @typedef {Object} Codec
 * @property {function(CurveState): Object} encode
 * @property {function(Object): CurveState} decode
 */
export const CurveCodec = {
  /**
   *  @param {CurveState} state
   *  @returns {StateMessage}
   */
  encode(state) {
    return {
      h1x: state.h1.x,
      h1y: state.h1.y,
      h2x: state.h2.x,
      h2y: state.h2.y,
    };
  },

  /**
   * @param {StateMessage} params
   * @returns {CurveState}
   */
  decode(params) {
    return {
      h1: { x: +params.h1x, y: +params.h1y },
      h2: { x: +params.h2x, y: +params.h2y },
    };
  },
};
