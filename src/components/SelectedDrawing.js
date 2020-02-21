import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';

import classNames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';

import './SelectedDrawing.css';

export default function SelectedDrawing() {
  const {
    state: {selectedDrawingDate, drawings, analytics},
    dispatch
  } = useContext(AppContext);

  const [includeLatest, setIncludeLatest] = useState(false);
  const selectedDrawing = analytics.dateOverall[selectedDrawingDate];
  const {
    numberSets: {numberSetsIncludeLatest, numberSetsExcludeLatest},
    drawingResult: selectedDrawingResult
  } = selectedDrawing;

  const selectedDrawingNumSets =
    includeLatest && numberSetsIncludeLatest
      ? numberSetsIncludeLatest
      : numberSetsExcludeLatest;

  return (
    <div className="selectedDrawing">
      <h2 className="selectedDrawingResult--header">
        Kết quả ngày {selectedDrawingDate}
      </h2>
      <div className="selectedDrawingResult">
        {selectedDrawingResult.map((num, idx) => {
          return <span key={idx}>{num}</span>;
        })}
      </div>

      {!!numberSetsIncludeLatest && (
        <div>
          <input
            checked={!!includeLatest}
            type="checkbox"
            id="includeLatestCb"
            onChange={() => {
              setIncludeLatest(!includeLatest);
            }}
          />
          <label htmlFor="includeLatestCb">Tính luôn kết quả mới nhất</label>
        </div>
      )}

      {selectedDrawingNumSets &&
        Object.keys(selectedDrawingNumSets).map((numSet, idx) => {
          const numSetData = selectedDrawingNumSets[numSet];
          const {isWinningNumberSet, data, matches} = numSetData;
          return (
            <div key={idx} className="numSetContainer">
              <h4 className="numSetTitle">
                <span>{numSet}</span>
                <span>{`${data.length} số`}</span>
                {!isWinningNumberSet && !includeLatest && (
                  <span>Trúng {matches.length}</span>
                )}
                {isWinningNumberSet && (
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} color="#8a00f3" />
                  </span>
                )}
              </h4>
              <code className="numSetNums">
                {data.map((num, idx) => {
                  return (
                    <span
                      key={idx}
                      className={classNames({
                        num: true,
                        isWinningNum: matches.indexOf(num) !== -1
                      })}
                    >
                      {num}
                    </span>
                  );
                })}
              </code>
            </div>
          );
        })}
    </div>
  );
}
