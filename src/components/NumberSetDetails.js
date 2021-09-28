import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';
import dayjs from 'dayjs';

import './NumberSetDetails.css';

function getNumDrawingsBetween(lotteryType, startDateStr, endDateStr) {
  const startDate = dayjs(startDateStr);
  const endDate = dayjs(endDateStr);
  const dates = [];
  let curDate = startDate;

  while (curDate.isBefore(endDate) || curDate.isSame(endDate)) {
    dates.push(curDate.format('YYYY-MM-DD'));
    curDate = curDate.add(1, 'day');
  }

  return (
    dates.filter(date => {
      const drawingDayOfWeek = {
        vietlott645: new Set([0, 3, 5]),
        vietlott655: new Set([2, 4, 6]),
        vietlott655_7: new Set([2, 4, 6])
      };

      return drawingDayOfWeek[lotteryType].has(dayjs(date).day());
    }).length - 1
  );
}

export default function NumberSetDetails({history}) {
  const {state} = useContext(AppContext);
  const {analytics, selectedNumberSet, originalDrawings} = state;
  const {
    numberSetOverall,
    metadata: {type}
  } = analytics;
  const latestDrawing = originalDrawings[0];
  const numberSetValue = numberSetOverall[selectedNumberSet];

  if (!numberSetValue) {
    return null;
  }

  return (
    <div className="numberSetDetails">
      <br />
      <h4>Chi tiết</h4>
      <div>
        {(() => {
          let lastResultMatchingDate;
          let now = new Date();

          return history.map((drawing, idx) => {
            const drawingDate = new Date(drawing.date);
            const timeElapsedSinceLastMatchingInDays = lastResultMatchingDate
              ? Math.round(
                  (lastResultMatchingDate - drawingDate) / (1000 * 60 * 60 * 24)
                )
              : Math.round((now - drawingDate) / (1000 * 60 * 60 * 24));

            const numDrawingsSinceLastMatching = getNumDrawingsBetween(
              type,
              drawingDate,
              lastResultMatchingDate
            );

            lastResultMatchingDate = drawingDate;

            return (
              <div className="numberSetContainer" key={idx}>
                <h4 className="numberSetTitle">
                  {timeElapsedSinceLastMatchingInDays && (
                    <span className="timeElapsedSinceLastMatchingInDays">
                      Cách {timeElapsedSinceLastMatchingInDays}d
                    </span>
                  )}
                  {/* <span>Cách đây {timeElapsedSinceNow} ngày</span> */}
                  {!!numDrawingsSinceLastMatching && (
                    <span className="drawingsElapsedSinceLastMatching">
                      Cách {numDrawingsSinceLastMatching} lần
                    </span>
                  )}
                  <span className="numberSetDrawingDate">{drawing.date}</span>
                  {/* <span>{drawing.numberSet.length} số</span> */}
                  {/* {numMatchesFilter === -1 && (
                    <span>Trúng {drawing.matches.length}</span>
                  )} */}
                </h4>
                <div className="numberSetNums">
                  {drawing.numberSet.map((num, idx) => {
                    return (
                      <span
                        key={idx}
                        className={classnames({
                          num: true,
                          mono: true,
                          isWinningNum: drawing.matches.indexOf(num) !== -1
                        })}
                      >
                        {num}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
