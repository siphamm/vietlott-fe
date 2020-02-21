import {useEffect} from 'react';
import {
  ALL_NUMBERS_645,
  ALL_NUMBERS_655,
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655
} from '../constants';
import stats from '../lib/analytics';

function typeToAllNumbers(type) {
  if (type === TYPE_VIETLOTT655) {
    return ALL_NUMBERS_655;
  }

  return ALL_NUMBERS_645;
}

export default function useLatestData(
  type = TYPE_VIETLOTT645,
  callback = null
) {
  useEffect(() => {
    console.log(`Getting latest data for ${type}`);
    const API_DRAWINGS = `https://rgc9a9lhu5.execute-api.us-west-2.amazonaws.com/dev/drawings?type=${type}`;
    fetch(API_DRAWINGS)
      .then(res => res.json())
      .then(res => {
        let _res = res;

        if (type === TYPE_VIETLOTT655) {
          _res.drawings = _res.drawings.map(drawing => {
            return {
              ...drawing,
              drawingResult: drawing.drawingResult
                .split(' ')
                .slice(0, 6)
                .join(' ')
            };
          });
        }

        const analytics = stats(_res.drawings, {
          allPossibleNumbers: typeToAllNumbers(type)
        });

        if (callback) {
          callback({
            drawings: _res.drawings,
            analytics
          });
        }
      });
  }, [type, callback]);
}
