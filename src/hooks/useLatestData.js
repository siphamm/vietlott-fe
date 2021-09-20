import {useEffect, useState} from 'react';
import {
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655,
  LATEST_DATA_URL,
  SET_NUMBER_SET_FOR_ANALYSIS
} from '../constants';
import lotteryTypeToQueryParam from '../lib/lotteryTypeToQueryParam';

export default function useLatestData(type = TYPE_VIETLOTT645) {
  const [drawings, setDrawings] = useState(null);

  useEffect(() => {
    console.log(`Getting latest data for ${type}`);
    const API_DRAWINGS = `${LATEST_DATA_URL}/${lotteryTypeToQueryParam(type)}`;
    fetch(API_DRAWINGS)
      .then(res => res.json())
      .then(res => {
        let _res = res;
        let drawings = [];

        // De-dup data
        const drawingDates = {};
        drawings = _res
          .filter(drawing => {
            if (drawingDates.hasOwnProperty(drawing.drawingDate)) {
              return false;
            }

            drawingDates[drawing.drawingDate] = true;
            return true;
          })
          .map((drawing, idx, originalArr) => {
            return {
              ...drawing
              // drawingId: originalArr.length - idx,
            };
          });

        // Make the IDs correct. This is hacky. IDs should come from DB, but for the time being
        // use this before fixing the scraping logic

        // Vietlott 655 (6 so'), remove so cuoi
        if (type === TYPE_VIETLOTT655) {
          drawings = drawings.map(drawing => {
            return {
              ...drawing,
              drawingResult: drawing.drawingResult
                .split(' ')
                .slice(0, 6)
                .join(' ')
            };
          });
        }

        setDrawings(drawings);

        // const analytics = stats(drawings, {
        //   allPossibleNumbers: typeToAllNumbers(type)
        // });
      });
  }, [type]);
  return drawings;
}
