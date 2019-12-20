function haveNotShown({
  allNumbers = [],
  data = [],
  lookBack = 1,
  includeLatest = false
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

  return new Set([...allNumbers].filter(x => !showed.has(x)));
}

function numberSetHasWinningResult(numberSet, result) {
  return [...result].every(num => numberSet.has(num));
}

function resultNumbersInNumberSet(numberSet, result) {
  return [...result].filter(num => numberSet.has(num));
}

function stats({allNumbers = [], data = [], n = 0, prefix = 'T'} = {}) {
  if (!data.length) {
    return {};
  }

  const MAX_LOOK_BACK = 10;
  let _data = [...data];

  _data.sort((a, b) => {
    if (a.drawingDate > b.drawingDate) {
      return -1;
    } else if (a.drawingDate < b.drawingDate) {
      return 1;
    }

    return 0;
  });

  const result = {
    n,
    latestDrawing: _data[0],
    drawingDateOverall: {},
    numSetOverall: {}, // T/1, T/2, etc.
    startingNumOverall: {} // 0x 1x 2x etc.
  };

  // const overallStats = _overallStats(_data);

  let c = 0;
  while (c < _data.length) {
    const cur = _data[c];
    const dataSubSet = _data.slice(c);
    const {drawingDate} = cur;
    const drawingResult = cur.drawingResult.split(' ');
    const drawingDateStats = {};
    let i;

    // Stats for numSets
    for (i = 1; i <= Math.min(MAX_LOOK_BACK, dataSubSet.length); i++) {
      const numSetKey = `${prefix}/${i}`;

      result.numSetOverall[numSetKey] = result.numSetOverall[numSetKey] || {
        numWinnings: 0,
        numDrawingsSincePreviousWinning: [],
        curLosingStreak: 0
      };

      const numSet = haveNotShown({
        allNumbers,
        data: dataSubSet,
        lookBack: i,
        includeLatest: false
      });

      const containsAllWinningNumbers = numberSetHasWinningResult(
        numSet,
        drawingResult
      );

      const winningNumbersInThisSet = resultNumbersInNumberSet(
        numSet,
        drawingResult
      );

      drawingDateStats[numSetKey] = {
        haveNotShown: numSet,
        containsAllWinningNumbers,
        winningNumbersInThisSet
      };

      if (containsAllWinningNumbers) {
        result.numSetOverall[numSetKey].numWinnings += 1;
        result.numSetOverall[numSetKey].numDrawingsSincePreviousWinning.push(
          result.numSetOverall[numSetKey].curLosingStreak
        );
        result.numSetOverall[numSetKey].curLosingStreak = 0;
      } else {
        result.numSetOverall[numSetKey].curLosingStreak =
          (result.numSetOverall[numSetKey].curLosingStreak || 0) + 1;
      }
    }

    result.drawingDateOverall[drawingDate] = drawingDateStats;

    // Increase c
    c += 1;
  }

  return result;
}

function _overallStats(data) {
  const res = {
    startingNumOverall: {
      '0x': {},
      '1x': {},
      '2x': {},
      '3x': {},
      '4x': {},
      '5x': {}
    }
  };

  // Stats for all data points
  data.forEach(drawing => {
    const {drawingResult} = drawing;
    const drawingResultArr = drawingResult.split(' ');

    drawingResultArr.forEach(num => {
      const startingNumGroup = `${num[0]}x`;
      res.startingNumOverall[startingNumGroup].numTotal =
        (res.startingNumOverall[startingNumGroup].numTotal || 0) + 1;

      if (parseInt(num, 10) % 2 === 0) {
        res.startingNumOverall[startingNumGroup].numEvenTotal =
          (res.startingNumOverall[startingNumGroup].numEvenTotal || 0) + 1;
      } else {
        res.startingNumOverall[startingNumGroup].numOddTotal =
          (res.startingNumOverall[startingNumGroup].numOddTotal || 0) + 1;
      }
    });
  });

  return res;
}

module.exports = {
  haveNotShown,
  numberSetHasWinningResult,
  resultNumbersInNumberSet,
  stats
};
