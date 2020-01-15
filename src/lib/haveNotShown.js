module.exports = function haveNotShown({
  allNumbers = [],
  data = [],
  lookBack = 1,
  includeLatest = false,
} = {}) {
  const startIdx = includeLatest ? 0 : 1;
  const _data = [...data];

  // Sort by drawingDate descending
  _data.sort((a, b) => {
    if (a.drawingDate > b.drawingDate) {
      return -1;
    } else if (a.drawingDate < b.drawingDate) {
      return 1;
    }

    return 0;
  });

  // Slice the latest <lookBack> drawing results
  const drawings = _data.slice(startIdx, startIdx + lookBack);
  const showed = new Set(
    drawings
      .reduce((acc, curr) => {
        const currResults = curr.drawingResult.split(' ');
        return acc.concat(currResults);
      }, [])
      .sort()
  );

  return new Set([...allNumbers].filter((x) => !showed.has(x)));
};
