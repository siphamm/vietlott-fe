import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import './NumberSetDetails.css';

export default function NumberSetDetails({history}) {
  const {state} = useContext(AppContext);
  const {analytics, selectedNumberSet, originalDrawings} = state;
  const {numberSetOverall} = analytics;
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
          let lastResultMatchingId = parseInt(latestDrawing.drawingId, 10);

          return history.map((drawing, idx) => {
            const drawingDate = new Date(drawing.date);
            const timeElapsedSinceLastMatchingInDays = lastResultMatchingDate
              ? Math.round(
                  (lastResultMatchingDate - drawingDate) / (1000 * 60 * 60 * 24)
                )
              : Math.round((now - drawingDate) / (1000 * 60 * 60 * 24));

            const drawingsElapsedSinceLastMatching = lastResultMatchingId
              ? lastResultMatchingId - drawing.id
              : null;
            lastResultMatchingDate = drawingDate;
            lastResultMatchingId = drawing.id;

            return (
              <div className="numberSetContainer" key={idx}>
                <h4 className="numberSetTitle">
                  {timeElapsedSinceLastMatchingInDays && (
                    <span className="timeElapsedSinceLastMatchingInDays">
                      {timeElapsedSinceLastMatchingInDays}d
                    </span>
                  )}
                  {/* <span>Cách đây {timeElapsedSinceNow} ngày</span> */}
                  {drawingsElapsedSinceLastMatching !== null && (
                    <span className="drawingsElapsedSinceLastMatching">
                      {drawingsElapsedSinceLastMatching} lần
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
