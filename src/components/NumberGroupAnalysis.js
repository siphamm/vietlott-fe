import React, {useContext, useState} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import './NumberGroupAnalysis.css';

export default function NumberGroupAnalysis() {
  const {state, dispatch} = useContext(AppContext);
  const [numRecentDrawingsFilter, setNumRecentDrawingsFilter] = useState(null);
  const {
    drawings,
    analytics: {numberGroupOverall}
  } = state;
  const filteredDrawings = !numRecentDrawingsFilter
    ? drawings
    : drawings.slice(0, numRecentDrawingsFilter);

  return (
    <div className="numberGroupAnalysis">
      <h1>
        Thống kê{' '}
        <input
          type="number"
          value={filteredDrawings.length}
          onChange={evt => {
            setNumRecentDrawingsFilter(parseInt(evt.target.value, 10));
          }}
        />{' '}
        lần quay
      </h1>
      <table>
        <thead>
          <tr>
            <th>Nhóm số</th>
            <th>Lần xuất hiện</th>
            <th>Lần quay</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(numberGroupOverall).map((numberGroup, idx) => {
            const {history, showings} = numberGroupOverall[numberGroup];
            return (
              <tr key={idx}>
                <td>{numberGroup}</td>
                <td>{showings}</td>
                <td>{history.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* <div>
        {Object.keys(numberGroupOverall).map((numberGroup, idx) => {
          const {history, showings} = numberGroupOverall[numberGroup];
          return (
            <div className="numSetContainer">
              <h4 key={idx} className="numSetTitle">
                <span>{numberGroup}</span>
                <span>Xuất hiện {history.length} lần</span>
                <span>
                  {((history.length * 100) / drawings.length).toFixed(2)}%
                </span>
              </h4>
              <div>
                {history.map((drawing, idx) => {
                  return (
                    <div key={idx}>
                      {drawing.matches.map((num, idx) => {
                        return (
                          <code className="num" key={idx}>
                            {num}
                          </code>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
