import React, { useContext, useState } from 'react';
import AppContext from '../data/app-context';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import './SelectedDrawing.css';

export default function SelectedDrawing() {
  const { state } = useContext(AppContext);
  const { selectedDrawingDate, selectedDrawingId, analytics } = state;
  const [includeLatest, setIncludeLatest] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const selectedDrawing = analytics.dateOverall[selectedDrawingDate];

  function onDeleteDrawing() {
    const {
      metadata: { type: lotteryType },
    } = analytics;
    const url =
      'https://rgc9a9lhu5.execute-api.us-west-2.amazonaws.com/dev/drawings';
    if (
      window.confirm('Are you sure you want to delete this drawing?') &&
      lotteryType
    ) {
      const type =
        lotteryType === 'vietlott645' ? 'vietlott645' : 'vietlott655';
      setIsSubmitting(true);
      setError(null);

      fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          type,
          drawingId: selectedDrawingId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setError(null);
          // window.location.reload();
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  if (!selectedDrawing) {
    return <div>Loading...</div>;
  }

  const {
    numberSets: { numberSetsIncludeLatest, numberSetsExcludeLatest },
    drawingResult: selectedDrawingResult,
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
      <button onClick={onDeleteDrawing}>Xóa kết quả này</button>
      <hr />
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
          const { isWinningNumberSet, data, matches } = numSetData;
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
                        isWinningNum: matches.indexOf(num) !== -1,
                      })}>
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
