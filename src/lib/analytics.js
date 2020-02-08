const haveNotShown = require('./haveNotShown');
const numberSetHasWinningResult = require('./numberSetHasWinningResult');
const resultNumbersInNumberSet = require('./resultNumbersInNumberSet');

function stats({ allNumbers = [], data = [], n = 0, prefix = 'T' } = {}) {
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
    startingNumOverall: {}, // 0x 1x 2x etc.
    pastDrawings: data,
    allNumbers,
    prefix,
  };

  const overallStats = _overallStats(_data);

  let c = 0;
  while (c < _data.length) {
    const cur = _data[c];
    const dataSubSet = _data.slice(c);
    const { drawingDate } = cur;
    const drawingResult = cur.drawingResult.split(' ');
    const drawingDateStats = {};
    let i;

    // Stats for numSets
    for (i = 1; i <= Math.min(MAX_LOOK_BACK, dataSubSet.length); i++) {
      const numSetKey = `${prefix}/${i}`;

      result.numSetOverall[numSetKey] = result.numSetOverall[numSetKey] || {
        numWinnings: 0,
        numDrawingsSincePreviousWinning: [],
        curLosingStreak: 0,
      };

      // Numbers that haven't shown up in the last i drawings, not including latest drawing
      // e.g. 645/3
      const numSet = haveNotShown({
        allNumbers,
        data: dataSubSet,
        lookBack: i,
        includeLatest: false,
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
        winningNumbersInThisSet,
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

    result.drawingDateOverall[drawingDate] = {
      drawingResult,
      numSets: drawingDateStats,
    };

    // Increase c
    c += 1;
  }

  result.overallStats = overallStats;
  return result;
}

function _overallStats(data) {
  let countAllNumbers = 0;
  const res = {
    startingNumOverall: {
      '0x': {},
      '1x': {},
      '2x': {},
      '3x': {},
      '4x': {},
      '5x': {},
    },
    frequency: {},
  };

  // Stats for all data points
  data.forEach((drawing) => {
    const { drawingResult } = drawing;
    const drawingResultArr = drawingResult.split(' ');

    drawingResultArr.forEach((num) => {
      // Tan suat xuat hien cua tung so
      if (!res.frequency.hasOwnProperty(num)) {
        res.frequency[num] = {
          count: 1,
        };
      } else {
        res.frequency[num].count = res.frequency[num].count + 1;
      }

      // startingNumGroup. e.g. 0x 1x 2x
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

      countAllNumbers++;
    });
  });

  // Update the pct of frequency for each number
  Object.keys(res.frequency).forEach((num) => {
    res.frequency[num].pct = res.frequency[num].count / countAllNumbers;
  });

  return res;
}

module.exports = {
  haveNotShown,
  numberSetHasWinningResult,
  resultNumbersInNumberSet,
  stats,
};
