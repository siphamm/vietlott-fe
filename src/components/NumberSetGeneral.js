import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import './NumberSetGeneral.css';

export default function NumberSetGeneral({history}) {
  const [showAppearedWinningNumbers, setShowAppearedWinningNumbers] = useState(
    true
  );
  const matchesCounts = history.reduce((acc, curr, idx) => {
    const {matches} = curr;

    matches.forEach(num => {
      acc[num] = (acc[num] || 0) + 1;
    });

    return acc;
  }, {});
  const {state} = useContext(AppContext);
  const {analytics, originalDrawings, selectedNumberSet} = state;
  const {dateOverall} = analytics;
  const latestDrawingDate = !originalDrawings.length
    ? null
    : originalDrawings[0].drawingDate;
  const latestNumberSetValue = !latestDrawingDate
    ? null
    : dateOverall[latestDrawingDate].numberSets.numberSetsIncludeLatest[
        selectedNumberSet
      ].data;
  const latestNumberSetExcludingAppearedWinningNumbers = latestNumberSetValue.filter(
    num => !matchesCounts.hasOwnProperty(num)
  );

  return (
    <div className="numberSetGeneral">
      <div>
        <br />
        <h4>Bộ số {selectedNumberSet} mới nhất</h4>
        <div>
          <input
            type="checkbox"
            id="excludeAppearedWinningNumbers"
            checked={!showAppearedWinningNumbers}
            onChange={() => {
              setShowAppearedWinningNumbers(!showAppearedWinningNumbers);
            }}
          />
          <label htmlFor="excludeAppearedWinningNumbers">
            loại những số đã trúng
          </label>
        </div>
        <div className="mono">
          {showAppearedWinningNumbers
            ? latestNumberSetValue.join(' ')
            : latestNumberSetExcludingAppearedWinningNumbers.join(' ')}
        </div>
      </div>
      <div>
        <br />
        <h4>Những số đã trúng</h4>
        <div className="numberSetNumberFrequencyContainer">
          {Object.keys(matchesCounts)
            .sort()
            .map(num => {
              const count = matchesCounts[num];
              return (
                <div className="numberSetNumberFrequency">
                  <span className="mono">{num}</span>
                  <span className="mono">{count}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
