Array.prototype.shuffle = function () {  // Knuth shuffle
  for (let i = 0; i < this.length; ++i) {
      const j = (Math.random() * (i+1)) | 0;
      const t = this[i]; this[i] = this[j]; this[j] = t;
  }
  return this;
}

Array.prototype.groupBy = function (fn) {
  return this.reduce((acc, x) => {
    const k = fn(x);
    (acc.get(k) ?? acc.set(k, []).get(k)).push(x);
    return acc;
  }, new Map);
}
