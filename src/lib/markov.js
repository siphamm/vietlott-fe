export default function markov(drawings) {
  const history = {};
  const score = {};

  // Generate a map of what numbers show up with what numbers
  drawings.forEach(drawing => {
    const {result: drawingResult} = drawing;

    drawingResult.forEach(resultNum => {
      if (!history.hasOwnProperty(resultNum)) {
        history[resultNum] = [];
      }

      history[resultNum].push(drawingResult);
    });
  });

  Object.keys(history).forEach(num => {
    const numberHistory = history[num];
    const numberAppearanceCount = numberHistory.length;
    const flattenHistory = flatten(numberHistory).sort();
    const optionsCount = count(flattenHistory);
    score[num] = {};

    for (let option in optionsCount) {
      const count = optionsCount[option];
      score[num][option] = count / numberAppearanceCount;
    }
  });

  return {
    history,
    score
  };
}

function flatten(arr) {
  let res = [];

  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(item);
    } else {
      res.push(item);
    }
  });

  return res;
}

function count(arr) {
  let st = 0;
  let end = 0;
  const res = {};

  while (end < arr.length) {
    while (arr[end] === arr[st]) {
      end++;
    }

    res[arr[st]] = end - st;

    st = end;
    end = end + 1;
  }

  return res;
}
