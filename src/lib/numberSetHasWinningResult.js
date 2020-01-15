module.exports = function numberSetHasWinningResult(numberSet, result) {
  return [...result].every((num) => numberSet.has(num));
};
