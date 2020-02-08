const { stats } = require('./lib/analytics');
const asynGetDrawings = require('./lib/getDrawings');
const writePrediction = require('./lib/writePrediction');
const { ALL_NUMBERS_645, ALL_NUMBERS_655 } = require('./lib/constants');

async function main() {
  const vietlott645Sample = await asynGetDrawings('vietlott645');
  const vietlott655Sample = await asynGetDrawings('vietlott655');

  await writePrediction({
    stats: stats({
      prefix: 'T',
      allNumbers: ALL_NUMBERS_645,
      data: vietlott645Sample,
    }),
    path: '645_3_history.txt',
    title: 'Thống kê những lần 645/3 trúng toàn bộ',
    mainNumSet: '3',
  });

  await writePrediction({
    stats: stats({
      prefix: 'T',
      allNumbers: ALL_NUMBERS_645,
      data: vietlott645Sample,
    }),
    path: '645_4_history.txt',
    title: 'Thống kê những lần 645/4 trúng toàn bộ',
    mainNumSet: '4',
  });

  await writePrediction({
    stats: stats({
      prefix: 'T',
      allNumbers: ALL_NUMBERS_655,
      data: vietlott655Sample.map((res) => {
        return {
          ...res,
          drawingResult: res.drawingResult
            .split(' ')
            .slice(0, 6)
            .join(' '),
        };
      }),
    }),
    path: '655_3_history.txt',
    title: 'Thống kê những lần 655/3 trúng toàn bộ 6 số',
    mainNumSet: '3',
  });

  await writePrediction({
    stats: stats({
      prefix: 'T',
      allNumbers: ALL_NUMBERS_655,
      data: vietlott655Sample.map((res) => {
        return {
          ...res,
          drawingResult: res.drawingResult
            .split(' ')
            .slice(0, 6)
            .join(' '),
        };
      }),
    }),
    path: '655_4_history.txt',
    title: 'Thống kê những lần 655/3 trúng toàn bộ 6 số',
    mainNumSet: '4',
  });
}

main();
