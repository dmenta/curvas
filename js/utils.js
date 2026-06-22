/**
 * @template T
 * @param {T[]|null|undefined} arr
 * @returns {T|undefined}
 */
export const peek = (arr) => arr?.at(-1);
