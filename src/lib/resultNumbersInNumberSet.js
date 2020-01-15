module.exports = function resultNumbersInNumberSet(numberSet, result) {
  return [...result].filter((num) => numberSet.has(num));
};
