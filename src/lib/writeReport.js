const fs = require('fs').promises;
const {table} = require('table');

async function write({stats, path, title}) {
  let f;
  let out = '';
  const {latestDrawing, drawingDateOverall, numSetOverall, n} = stats;
  const {drawingDate, drawingResult} = latestDrawing;
  const latestDrawingStat = drawingDateOverall[drawingDate];

  if (!path) {
    path = `${new Date().getTime()}_report.txt`;
  }

  try {
    f = await fs.open(`./${path}`, 'w+');

    if (title.length) {
      out += `${title}\n`;
    }

    out += `Kết quả mới nhất (${drawingDate}): ${drawingResult}\n\n`;

    for (let numSetGroup in latestDrawingStat) {
      const stat = latestDrawingStat[numSetGroup];
      const {haveNotShown, winningNumbersInThisSet} = stat;
      const numSetStats = numSetOverall[numSetGroup];
      const {
        curLosingStreak,
        numWinnings,
        numDrawingsSincePreviousWinning
      } = numSetStats;

      out += `\n${numSetGroup}`;
      // out += `\nKHÔNG TÍNH KQUẢ MỚI NHẤT:`;
      out += `\n${haveNotShown.size} số chưa ra: ${[...haveNotShown].join(
        ' '
      )}`;

      if (winningNumbersInThisSet.length) {
        out += `\nTrúng ${
          winningNumbersInThisSet.length
        } số: ${winningNumbersInThisSet.join(' ')}`;
      }

      // out += `\n\nTÍNH LUÔN KQUẢ MỚI NHẤT:`;
      // out += `\n${n} lần gần nhất:`;
      out += `\n\nTính đến nay: ${numWinnings} lần trúng toàn bộ`;

      if (numWinnings) {
        out += `\n${numDrawingsSincePreviousWinning[0]} lần xổ gần nhất chưa trúng`;
      }

      if (numDrawingsSincePreviousWinning.length > 1) {
        out += `\n\nKhoảng cách giữa các lần trúng toàn bộ trước: (lần xổ)\n`;
        out += `${numDrawingsSincePreviousWinning.slice(1).join(', ')}`;
      }

      const data = [
        ['0A', '0B', '0C'],
        ['1A', '1B', '1C'],
        ['2A', '2B', '2C']
      ];

      const tableConfig = {
        border: {
          topBody: `─`,
          topJoin: `┬`,
          topLeft: `┌`,
          topRight: `┐`,

          bottomBody: `─`,
          bottomJoin: `┴`,
          bottomLeft: `└`,
          bottomRight: `┘`,

          bodyLeft: `│`,
          bodyRight: `│`,
          bodyJoin: `│`,

          joinBody: `─`,
          joinLeft: `├`,
          joinRight: `┤`,
          joinJoin: `┼`
        }
      };

      // out += `\n${table(data, tableConfig)}`;

      out += '\n\n';
      out += '====================================';
      out += '\n';
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
