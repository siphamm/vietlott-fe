import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import NumberSetDetails from './NumberSetDetails';
import NumberSetGeneral from './NumberSetGeneral';
import classnames from 'classnames';

import './NumberSetAnalysis.css';

export default function NumberSetAnalysis() {
  const [numMatchesFilter, setNumMatchesFilter] = useState(-1);
  const [numLastWinnings, setNumLastWinnings] = useState(-1);
  const {state} = useContext(AppContext);
  const {analytics, selectedNumberSet} = state;
  const {numberSetOverall} = analytics;
  const numberSetValue = numberSetOverall[selectedNumberSet];
  const numMatchesFilterOptions = Object.keys(numberSetValue.byMatchesCount);
  const historyBeforeNumLastWinningsFilter =
    numMatchesFilter === -1
      ? numberSetValue.history
      : numberSetValue.history.filter(drawing => {
          return drawing.matches.length === numMatchesFilter;
        });

  const history =
    numLastWinnings === -1
      ? historyBeforeNumLastWinningsFilter
      : historyBeforeNumLastWinningsFilter.slice(0, numLastWinnings);

  if (!numberSetValue) {
    return null;
  }

  return (
    <div className="numberSetAnalysis">
      <div className="numberSetAnalysisFilters">
        <div>
          <select
            value={numLastWinnings}
            onChange={evt => {
              setNumLastWinnings(parseInt(evt.target.value, 10));
            }}
          >
            <option value={-1}>---</option>
            {Array(historyBeforeNumLastWinningsFilter.length)
              .fill(null)
              .map((item, idx) => idx + 1)
              .map((num, idx) => {
                return (
                  <option key={idx} value={num}>
                    {num}
                  </option>
                );
              })}
          </select>{' '}
          lần trúng gần nhất
        </div>
        <div>
          , trúng{' '}
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
      </div>

      <NumberSetGeneral history={history} />
      <NumberSetDetails numMatchesFilter={numMatchesFilter} history={history} />
    </div>
  );
}
