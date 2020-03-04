import {useEffect, useState} from 'react';
import {
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655,
  LATEST_DATA_URL
} from '../constants';
import lotteryTypeToQueryParam from '../lib/lotteryTypeToQueryParam';

export default function useLatestData(type = TYPE_VIETLOTT645) {
  const [drawings, setDrawings] = useState(null);

  useEffect(() => {
    console.log(`Getting latest data for ${type}`);
    const API_DRAWINGS = `${LATEST_DATA_URL}?type=${lotteryTypeToQueryParam(
      type
    )}`;
    fetch(API_DRAWINGS)
      .then(res => res.json())
      .then(res => {
        let _res = res;

        // Vietlott 655 (6 so'), remove so cuoi
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

        setDrawings(_res.drawings);

        // const analytics = stats(_res.drawings, {
        //   allPossibleNumbers: typeToAllNumbers(type)
        // });
      });
  }, [type]);

  return drawings;
}
