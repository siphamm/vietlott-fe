import {useEffect, useState} from 'react';
import {
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655,
  LATEST_DATA_URL,
  GET_DATA
} from '../constants';
import lotteryTypeToQueryParam from '../lib/lotteryTypeToQueryParam';

const cached = {};

export default function useLatestData(type = TYPE_VIETLOTT645, dispatch) {
  const [drawings, setDrawings] = useState(null);

  useEffect(() => {
    async function fetchData() {
      dispatch({type: GET_DATA});

      if (cached[type]) {
        setDrawings(cached[type]);
      } else {
        const API_DRAWINGS = `${LATEST_DATA_URL}/${lotteryTypeToQueryParam(
          type
        )}`;

        const drawings = await fetch(API_DRAWINGS)
          .then(res => res.json())
          .then(drawings => {
            drawings = drawings.map(drawing => {
              return {
                ...drawing,
                drawingResult:
                  type === TYPE_VIETLOTT655
                    ? drawing.drawingResult.split(' ').slice(0, 6).join(' ') // Vietlott 655 (6 so'), remove so cuoi
                    : drawing.drawingResult
              };
            });

            return drawings;
          });

        cached[type] = drawings;
        setDrawings(drawings);
      }
    }

    fetchData();
  }, [type, dispatch]);

  return drawings;
}
