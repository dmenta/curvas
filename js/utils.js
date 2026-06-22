Array.prototype.peek = function () {
  if (this.length > 0) {
    return this.at(-1);
  }
  return undefined;
};
