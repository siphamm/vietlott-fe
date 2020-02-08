const fs = require('fs').promises;

function printWithPadding(numSet, allNumbers) {
  let res = [...allNumbers]
    .map((num) => {
      return numSet.has(num) ? num : '  ';
    })
    .join(', ');
  return res;
}

async function write({ stats, path, title, mainNumSet = '3' }) {
  let f;
  let out = '';
  const {
    latestDrawing,
    drawingDateOverall,
    numSetOverall,
    n,
    allNumbers,
    prefix,
  } = stats;
  const { drawingDate, drawingResult } = latestDrawing;
  const latestDrawingStat = drawingDateOverall[drawingDate];
  let drawingsLapsedSinceLastWinning = 0;
  let isLastWinning = true;

  if (!path) {
    path = `${new Date().getTime()}_report.txt`;
  }

  try {
    f = await fs.open(`./${path}`, 'w+');

    if (title.length) {
      out += `${title}`;
    }

    const data = Object.keys(drawingDateOverall).map((ds) => {
      return {
        ds,
        ...drawingDateOverall[ds],
      };
    });

    for (let i = 0, len = data.length; i < len; i++) {
      drawingsLapsedSinceLastWinning += 1;
      const dsResult = data[i];
      const ds = dsResult.ds;
      const dsDrawingResult = dsResult.drawingResult;
      const numSetKey = `${prefix}/${mainNumSet}`;
      const dsT3NumSet = dsResult.numSets[numSetKey];

      if (dsT3NumSet && dsT3NumSet.containsAllWinningNumbers) {
        out += `\n\nNgày ${ds}. Kết quả: ${dsDrawingResult}`;
        if (!isLastWinning) {
          out += `\nCách lần trúng sau ${drawingsLapsedSinceLastWinning} lần quay`;
        }
        out += `\nBộ số: ${[...dsT3NumSet.haveNotShown]}`;

        const lookback = 10;
        out += `\n\n${lookback} bộ số trước đó:`;
        let j = i;
        while (j <= i + lookback && j < data.length) {
          const nextDsResult = data[j];
          if (nextDsResult.numSets[numSetKey]) {
            out += `\n${printWithPadding(
              nextDsResult.numSets[numSetKey].haveNotShown,
              allNumbers
            )}`;
          }
          j++;
        }

        out += `\n\n======================================`;
        drawingsLapsedSinceLastWinning = 0;
        isLastWinning = false;
      }
    }

    await f.appendFile(out);
  } catch (e) {
    console.error(e);
  } finally {
    if (f) {
      f.close();
    }
  }
}

module.exports = write;
