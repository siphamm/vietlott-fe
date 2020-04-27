import markov from './markov';

export default function stats(
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
    numberOverall: {},
    markov: markov(_drawings)
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
    let numberGroupsOfCurDrawing = {};
    drawingResult.forEach(resultNumber => {
      const numberGroup = `${resultNumber[0]}x`;
      const numberType = parseInt(resultNumber, 10) % 2 === 0 ? 'even' : 'odd';
      const endDigitNumberGroup = `x${resultNumber[resultNumber.length - 1]}`;

      // Number groups
      if (!numberGroupsOfCurDrawing.hasOwnProperty(numberGroup)) {
        numberGroupsOfCurDrawing[numberGroup] = [];
      }
      numberGroupsOfCurDrawing[numberGroup].push(resultNumber);

      // Number types. e.g. odd, even
      if (!numberGroupsOfCurDrawing.hasOwnProperty(numberType)) {
        numberGroupsOfCurDrawing[numberType] = [];
      }
      numberGroupsOfCurDrawing[numberType].push(resultNumber);

      // Ending digit type
      if (!numberGroupsOfCurDrawing.hasOwnProperty(endDigitNumberGroup)) {
        numberGroupsOfCurDrawing[endDigitNumberGroup] = [];
      }
      numberGroupsOfCurDrawing[endDigitNumberGroup].push(resultNumber);

      // The number itself
      if (!numberGroupsOfCurDrawing.hasOwnProperty(resultNumber)) {
        numberGroupsOfCurDrawing[resultNumber] = [];
      }

      numberGroupsOfCurDrawing[resultNumber].push(resultNumber);
    });

    // Add the numberGroups from this drawing to the endResult
    Object.keys(numberGroupsOfCurDrawing).forEach(numberGroup => {
      const matches = numberGroupsOfCurDrawing[numberGroup];
      if (!endResult.numberGroupOverall.hasOwnProperty(numberGroup)) {
        endResult.numberGroupOverall[numberGroup] = {
          history: [],
          showings: 0
        };
      }

      endResult.numberGroupOverall[numberGroup].history.push({
        date,
        id,
        matches,
        result: drawingResult
      });

      endResult.numberGroupOverall[numberGroup].showings += matches.length;
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

  return endResult;
}

function _getNumberSetsForDrawing(
  drawings = [],
  {
    startIdx = 0,
    excludeLatest = false,
    allPossibleNumbers = [],
    numberSetsCount = 20,
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
