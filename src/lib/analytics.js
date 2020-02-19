const haveNotShown = require('./haveNotShown');
const numberSetHasWinningResult = require('./numberSetHasWinningResult');
const resultNumbersInNumberSet = require('./resultNumbersInNumberSet');
const DEFAULT_NUM_SET_PREFIX = 'N-';
/* 

stats = {
  metadata: {
    prefix: 'N-',
    numLookBackDrawings: 100,
    drawingResultLength: 7, 6, etc.
    allPossibleNumbers: ['01', '02', ...., '45'],
  },
  dateOverall: {
    '2020/02/20': {
      drawingResult: [01, 14, 15, 23, 25, 45],
      numberSets: {
        'N-1': {
          data: [01, 02, 14, 37],
          matches: [01, 14],
          isWinningNumberSet: true/false,
        },
      },
    },
    '2020/02/18': {}
  },
  numberSetOverall: {
    'N-1': {
      byMatchesCount: {
        6: [ // start at drawingResultLength
          {
            drawingDate: '2020/02/10',
            drawingId: 234,
          },
          {
            drawingDate: '2019/12/29',
            drawingId: 221,
          }
        ],
        5: [],
        4: [],
      },
      history: [],
    },
    'N-2': {},
  }, // N-1, N-2, etc.
  numberGroupOverall: {
    '0x': {
      numShowings: 234, // raw total of how many 0x numbers showed up in drawing results. This is sum of history.numbers.length
      numAppearances: 87, // if any drawing result has any number in 0x group, it counts as 1 appearance of this group. This is history.length
      showingPercentage: 0.34, // numShowings or (sum of history.numbers.length) divided by total numbers showing up in drawings
      appearancePercentag: 0.4, // numAppearances or history.length divided by the number of drawings
      history: [
        {
          drawingDate: '2020/02/18',
          drawingId: 234,
          numbers: [02, 04, 09]
        },
        {
          drawingDate: '2020/01/29',
          drawingId: 223,
          numbers: [01]
        },
      ],
    },
    '1x': {},
  } // 0x, 1x, etc.
  numberOverall: {
    '01': {
      numShowings: 100,
      showingPercentage: 0.2,
      appearancePercentage: 0.4,
      history: [
        {
          drawingDate: '2020/02/18',
          drawingId: 234,
        },
        {
          drawingDate: '2020/01/29',
          drawingId: 223,
        },
      ],
    },
    '02': {},
  }, // 01, 02, 24, 45, etc.
}


*/

export function stats1(
  drawings = [],
  {
    type = 'vietlott645',
    prefix = 'N-',
    numLookBackDrawings = null,
    allPossibleNumbers = []
  } = {}
) {
  if (!drawings.length || !allPossibleNumbers) {
    return;
  }

  let _drawings = [...drawings];

  // @TODO implement this
  // const allPossibleNumbers = _getAllPossibleNumbersFromType(type);

  // Sort drawings by date DESC
  _drawings.sort((a, b) => {
    if (a.drawingDate > b.drawingDate) {
      return -1;
    } else if (a.drawingDate < b.drawingDate) {
      return 1;
    }

    return 0;
  });

  // Slice <numLookBackDrawings> elements
  if (numLookBackDrawings) {
    _drawings = _drawings.slice(0, numLookBackDrawings);
  }

  // Transform the drawings array
  _drawings = _drawings.map(drawing => {
    return {
      id: drawing.drawingId,
      result: drawing.drawingResult.split(' '),
      date: drawing.drawingDate
    };
  });

  // Init the result object
  const endResult = {
    metadata: {
      type,
      prefix,
      numLookBackDrawings,
      allPossibleNumbers
    },
    dateOverall: {},
    numberSetOverall: {},
    numberGroupOverall: {},
    numberOverall: {}
  };

  // Do the actual analysis/calculations //

  // For each drawing
  _drawings.forEach((drawing, drawingIdx) => {
    const {date, result: drawingResult, id} = drawing;

    // Only calculate "number sets including latest drawing" for the latest drawing, for
    // other drawings, it doesn't make sense
    const numberSetsIncludeLatest =
      drawingIdx === 0
        ? _getNumberSetsForDrawing(_drawings, {
            startIdx: drawingIdx,
            allPossibleNumbers: allPossibleNumbers
          })
        : null;

    const numberSetsExcludeLatest = _getNumberSetsForDrawing(_drawings, {
      startIdx: drawingIdx,
      excludeLatest: true,
      allPossibleNumbers: allPossibleNumbers
    });

    // Go through the number sets to calculate the stats for number sets
    Object.keys(numberSetsExcludeLatest).forEach(numberSetKey => {
      if (!endResult.numberSetOverall.hasOwnProperty(numberSetKey)) {
        endResult.numberSetOverall[numberSetKey] = {
          byMatchesCount: {},
          history: []
        };
      }

      const numberSet = numberSetsExcludeLatest[numberSetKey];
      const {matches, data} = numberSet;
      const matchesCount = matches ? matches.length : 0;

      // History
      endResult.numberSetOverall[numberSetKey].history.push({
        date,
        id,
        result: drawingResult,
        numberSet: data,
        matches
      });

      // Matches
      endResult.numberSetOverall[numberSetKey].byMatchesCount[matchesCount] =
        endResult.numberSetOverall[numberSetKey].byMatchesCount[matchesCount] ||
        [];

      endResult.numberSetOverall[numberSetKey].byMatchesCount[
        matchesCount
      ].push({
        date,
        id,
        result: drawingResult,
        matches
      });
    });

    // For each number in this drawing's result
    drawingResult.forEach(resultNumber => {
      const numberGroup = `${resultNumber[0]}x`;

      if (!endResult.numberGroupOverall.hasOwnProperty(numberGroup)) {
        endResult.numberGroupOverall[numberGroup] = {
          history: [],
          numShowings: 0,
          numAppearances: 0
        };
      }

      // Push to history
      // @TODO: this is not right. Should only push 1 history for one drawing, not every drawing num. Fix this
      endResult.numberGroupOverall[numberGroup].history.push({
        result: drawingResult,
        id,
        date
      });
    });

    // Assign the endResult properties
    endResult.dateOverall[date] = {
      drawingResult,
      numberSets: {
        numberSetsIncludeLatest,
        numberSetsExcludeLatest
      }
    };
  });

  console.log(endResult);
  return endResult;
}

function _getAllPossibleNumbersFromType(type) {
  if (type === 'vietlott645') {
    return;
  }
}

function _getNumberSetsForDrawing(
  drawings = [],
  {
    startIdx = 0,
    excludeLatest = false,
    allPossibleNumbers = [],
    numberSetsCount = 10,
    prefix = 'N-'
  } = {}
) {
  if (!drawings.length) {
    return;
  }

  const res = {};
  const accummulatedDrawings = [];
  const numbersShownUp = new Set();
  const {result: originalDrawingResult} = drawings[startIdx];
  const start = excludeLatest ? startIdx + 1 : startIdx;

  // Calculate all numbers that have shown up in the last X drawings, starting from <startIdx>
  for (let x = 0; x < numberSetsCount; x++) {
    const numberSetKey = `${prefix}${x + 1}`;
    const curDrawing = drawings[start + x];

    if (curDrawing) {
      const {date, result: drawingResult} = curDrawing;

      // Push this drawing to running list of the last X drawings
      accummulatedDrawings.push(curDrawing);

      // Add all the numbers in this drawing to running list of all numbers in last X drawings
      drawingResult.forEach(resultNum => {
        numbersShownUp.add(resultNum);
      });

      const numbersNotShownUp = new Set(
        [...allPossibleNumbers].filter(x => !numbersShownUp.has(x))
      );

      const matches = originalDrawingResult.filter(num =>
        numbersNotShownUp.has(num)
      );

      res[numberSetKey] = {
        data: [...numbersNotShownUp],
        matches,
        isWinningNumberSet: matches.length === drawingResult.length
      };
    }
  }

  return res;
}

/*




*/

function stats({
  allNumbers = [],
  data = [],
  n = 0,
  prefix = DEFAULT_NUM_SET_PREFIX
} = {}) {
  if (!data.length) {
    return {};
  }

  const MAX_LOOK_BACK = 10;

  // Make a copy
  let _data = [...data];

  // Sort latest drawing on top
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
    prefix
  };

  const overallStats = _overallStats(_data);
  let c = 0;

  while (c < _data.length) {
    const cur = _data[c];
    const dataSubSet = _data.slice(c);
    const {drawingDate} = cur;
    const drawingResult = cur.drawingResult.split(' ');
    const drawingDateStats = {};
    let i;
    let hasAWinningNumSet = false;

    // Stats for numSets
    for (i = 1; i <= Math.min(MAX_LOOK_BACK, dataSubSet.length); i++) {
      const numSetKey = `${prefix}${i}`;

      result.numSetOverall[numSetKey] = result.numSetOverall[numSetKey] || {
        numWinnings: 0,
        numDrawingsSincePreviousWinning: [],
        curLosingStreak: 0
      };

      // Numbers that haven't shown up in the last i drawings, not including latest drawing
      // e.g. 645/3
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
        hasAWinningNumSet = true;
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
      hasAWinningNumSet: hasAWinningNumSet,
      drawingResult,
      numSets: drawingDateStats
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
      '5x': {}
    },
    frequency: {}
  };

  // Stats for all data points
  data.forEach(drawing => {
    const {drawingResult} = drawing;
    const drawingResultArr = drawingResult.split(' ');

    drawingResultArr.forEach(num => {
      // Tan suat xuat hien cua tung so
      if (!res.frequency.hasOwnProperty(num)) {
        res.frequency[num] = {
          count: 1
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
  Object.keys(res.frequency).forEach(num => {
    res.frequency[num].pct = res.frequency[num].count / countAllNumbers;
  });

  return res;
}

export default stats;
