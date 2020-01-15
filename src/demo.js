const { stats } = require('./lib/analytics');
const { data } = require('./lib/mock');
const asynGetDrawings = require('./lib/getDrawings');
const writeReport = require('./lib/writeReport');
const { ALL_NUMBERS_645, ALL_NUMBERS_655 } = require('./lib/constants');

// const sample = data;
async function main() {
  const vietlott645Sample = await asynGetDrawings('vietlott645');
  const vietlott655Sample = await asynGetDrawings('vietlott655');

  writeReport({
    stats: stats({
      prefix: '645',
      allNumbers: ALL_NUMBERS_645,
      data: vietlott645Sample,
    }),
    path: '645_report.txt',
    title: 'Thống kê Vietlott 645',
  });

  // writeReport({
  //   stats: stats({
  //     prefix: '655',
  //     allNumbers: ALL_NUMBERS_655,
  //     data: vietlott655Sample
  //   }),
  //   path: '655_report.txt',
  //   title: 'Thống kê Vietlott 655 (7 số)'
  // });

  // writeReport({
  //   stats: stats({
  //     prefix: '655',
  //     allNumbers: ALL_NUMBERS_655,
  //     data: vietlott655Sample.map(res => {
  //       return {
  //         ...res,
  //         drawingResult: res.drawingResult
  //           .split(' ')
  //           .slice(0, 6)
  //           .join(' ')
  //       };
  //     })
  //   }),
  //   path: '655_6_num_report.txt',
  //   title: 'Thống kê Vietlott 655 (6 số)'
  // });
}

main();
