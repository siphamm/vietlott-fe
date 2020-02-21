import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import './NumberSetAnalysis.css';

export default function NumberSetAnalysis() {
  const [numMatchesFilter, setNumMatchesFilter] = useState(-1);
  const {state} = useContext(AppContext);
  const {analytics, selectedNumberSet} = state;
  const {numberSetOverall} = analytics;
  const numberSetValue = numberSetOverall[selectedNumberSet];
  const numMatchesFilterOptions = Object.keys(numberSetValue.byMatchesCount);
  const history =
    numMatchesFilter === -1
      ? numberSetValue.history
      : numberSetValue.history.filter(drawing => {
          return drawing.matches.length === numMatchesFilter;
        });

  if (!numberSetValue) {
    return null;
  }

  return (
    <div className="numberSetAnalysis">
      <div>
        Trúng{' '}
        <select
          value={numMatchesFilter}
          onChange={evt => {
            setNumMatchesFilter(parseInt(evt.target.value, 10));
          }}
        >
          <option value={-1}>---</option>
          {numMatchesFilterOptions.map((num, idx) => {
            return (
              <option key={idx} value={num}>
                {num}
              </option>
            );
          })}
        </select>{' '}
        số
      </div>
      <div>
        {history.map((drawing, idx) => {
          return (
            <div className="numSetContainer" key={idx}>
              <h4 className="numSetTitle">
                <span>{drawing.date}</span>
                <span>{drawing.numberSet.length} số</span>
                {numMatchesFilter === -1 && (
                  <span>Trúng {drawing.matches.length}</span>
                )}
              </h4>
              <code className="numSetNums">
                {drawing.numberSet.map((num, idx) => {
                  return (
                    <span
                      key={idx}
                      className={classnames({
                        num: true,
                        isWinningNum: drawing.matches.indexOf(num) !== -1
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
    </div>
  );
}
