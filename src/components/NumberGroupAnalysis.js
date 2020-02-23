import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import {ALL_NUMBERS_655} from '../constants';
import classnames from 'classnames';

import './NumberGroupAnalysis.css';

export default function NumberGroupAnalysis() {
  const {state, dispatch} = useContext(AppContext);
  const {
    drawings,
    analytics: {numberGroupOverall}
  } = state;
  const BREAK = 'break';

  return (
    <div className="numberGroupAnalysis">
      <table className="numberGroups">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Lần xuất hiện</th>
            <th>Lần quay</th>
            <th>Đơn</th>
            <th>Kép</th>
            <th>Tam</th>
            <th>Bốn</th>
            <th>Năm</th>
          </tr>
        </thead>
        <tbody>
          {[
            'even',
            'odd',
            BREAK,
            '0x',
            '1x',
            '2x',
            '3x',
            '4x',
            '5x',
            BREAK,
            'x0',
            'x1',
            'x2',
            'x3',
            'x4',
            'x5',
            'x6',
            'x7',
            'x8',
            'x9',
            BREAK,
            ...ALL_NUMBERS_655
          ].map((numberGroup, idx) => {
            if (numberGroup === BREAK) {
              return (
                <tr key={idx} className="breakRow">
                  <td colSpan="8"></td>
                </tr>
              );
            }

            if (!numberGroupOverall.hasOwnProperty(numberGroup)) {
              return null;
            }

            const {history, showings} = numberGroupOverall[numberGroup];
            const repeatedShowingsInSameDrawing = history.reduce((acc, cur) => {
              const numRepeat = cur.matches.length;
              acc[numRepeat] = (acc[numRepeat] || 0) + 1;
              return acc;
            }, {});

            return (
              <tr key={idx}>
                <td className="numberGroupName">
                  {numberGroup === 'odd'
                    ? 'Lẻ'
                    : numberGroup === 'even'
                    ? 'Chẵn'
                    : numberGroup}
                </td>
                <td className="mono">{showings}</td>
                <td className="mono">
                  {history.length}{' '}
                  <small>
                    ({((history.length * 100) / drawings.length).toFixed(0)}%)
                  </small>
                </td>
                {[1, 2, 3, 4, 5].map((numRepeat, idx) => {
                  return (
                    <td className="mono" key={idx}>
                      {repeatedShowingsInSameDrawing[numRepeat] && (
                        <>
                          {repeatedShowingsInSameDrawing[numRepeat]}{' '}
                          <small>
                            (
                            {(
                              (repeatedShowingsInSameDrawing[numRepeat] * 100) /
                              history.length
                            ).toFixed(0)}
                            %)
                          </small>
                        </>
                      )}
                    </td>
                  );
                })}
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
