import {useEffect, useState} from 'react';
import {
  TYPE_VIETLOTT645,
  TYPE_VIETLOTT655,
  LATEST_DATA_URL,
  GET_DATA
} from '../constants';
import lotteryTypeToQueryParam from '../lib/lotteryTypeToQueryParam';

const cached = {};

function visualize(numDrawingsSinceLast) {
  const result = {};

  Object.keys(numDrawingsSinceLast).forEach(number => {
    result[number] = new Array(numDrawingsSinceLast[number] + 1)
      .fill('_')
      .join('');
  });

  return result;
}

function genStatsByBall(drawings) {
  return drawings.slice(0, 50).reduceRight((acc, drawing) => {
    const {numDrawingsSinceLast} = drawing;

    Object.keys(numDrawingsSinceLast).forEach(ball => {
      const countDrawingsBefore = numDrawingsSinceLast[ball];

      acc[ball] = acc[ball] || '';
      acc[ball] += countDrawingsBefore === 0 ? 'x' : ' ';
    });

    return acc;
  }, {});
}

export default function useLatestData(type = TYPE_VIETLOTT645, dispatch) {
  const [drawings, setDrawings] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const url = `${LATEST_DATA_URL}/${lotteryTypeToQueryParam(type)}`;
      let drawings;

      if (cached[url]) {
        drawings = cached[url];
      } else {
        dispatch({type: GET_DATA});
        drawings = await fetch(url)
          .then(res => res.json())
          .then(resDrawings => {
            cached[url] = resDrawings;
            return resDrawings;
          });
      }

      drawings = drawings.map(drawing => {
        // const numDrawingsSinceLast = JSON.parse(drawing.numDrawingsSinceLast);
        return {
          ...drawing,
          // numDrawingsSinceLast,
          // visual: visualize(numDrawingsSinceLast),
          drawingResult:
            type === TYPE_VIETLOTT655
              ? drawing.drawingResult.split(' ').slice(0, 6).join(' ') // Vietlott 655 (6 so'), remove so cuoi
              : drawing.drawingResult
        };
      });
      setDrawings(drawings);
    }

    fetchData();
  }, [type, dispatch]);

  return drawings;
}
