// calculate composite rating from arrays
function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}
function composite(ratings) {
  // example weights: uniq 30%, vibe 30%, safety 20%, crowd 20% (inverted)
  const u = avg(ratings.uniqueness);
  const v = avg(ratings.vibe);
  const s = avg(ratings.safety);
  const c = avg(ratings.crowd);
  // invert crowd: less crowded → higher score
  const invCrowd = 5 - c;
  const score = (u * 0.3 + v * 0.3 + s * 0.2 + invCrowd * 0.2);
  return Math.round(score * 10) / 10;
}

module.exports = { composite };
