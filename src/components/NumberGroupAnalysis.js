import React, {useContext, useState, useRef} from 'react';
import AppContext from '../data/app-context';
import {ALL_NUMBERS_655} from '../constants';
import classnames from 'classnames';

import './NumberGroupAnalysis.css';

export default function NumberGroupAnalysis() {
  const {state} = useContext(AppContext);
  const [showDetails, setShowDetails] = useState(true);
  const {
    drawings,
    analytics: {numberGroupOverall}
  } = state;
  const BREAK = 'break';

  return (
    <div className="numberGroupAnalysis">
      <div className="numberGroup-seeDetails">
        <input
          defaultChecked={showDetails}
          id="numberGroup-seeDetailsCb"
          type="checkbox"
          onClick={() => {
            setShowDetails(!showDetails);
          }}
        />{' '}
        <label htmlFor="numberGroup-seeDetailsCb">Xem chi tiết</label>
      </div>
      <h4>Thống kê trong {drawings.length} lần quay gần nhất</h4>
      <br />
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
            '0x',
            '1x',
            '2x',
            '3x',
            '4x',
            '5x',
            BREAK,
            'even',
            'odd',
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
            const shouldShowOddEvenBreakdown = new Set([
              '0x',
              '1x',
              '2x',
              '3x',
              '4x',
              '5x'
            ]).has(numberGroup);

            const numberGroupOddEvenCount = history.reduce(
              (acc, cur) => {
                cur.matches.forEach(drawingResultNum => {
                  const type = drawingResultNum % 2 === 0 ? 'even' : 'odd';
                  acc[type][drawingResultNum] =
                    (acc[type][drawingResultNum] || 0) + 1;
                });

                return acc;
              },
              {
                odd: {},
                even: {}
              }
            );

            const repeatedShowingsInSameDrawingCount = history.reduce(
              (acc, cur) => {
                const numRepeat = cur.matches.length;
                acc[numRepeat] = (acc[numRepeat] || 0) + 1;
                return acc;
              },
              {}
            );

            return (
              <>
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
                        {repeatedShowingsInSameDrawingCount[numRepeat] && (
                          <>
                            {repeatedShowingsInSameDrawingCount[numRepeat]}{' '}
                            <small>
                              (
                              {(
                                (repeatedShowingsInSameDrawingCount[numRepeat] *
                                  100) /
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
                {showDetails && !ALL_NUMBERS_655.has(numberGroup) && (
                  <tr className="numberGroupDetails">
                    <td>&nbsp;</td>
                    <td colSpan="7">
                      <table className="numberGroupDetailsContainer">
                        {/* <thead>
                          <tr>
                            {shouldShowOddEvenBreakdown && (
                              <>
                                <td>Chẵn</td>
                                <td>Lẻ</td>
                              </>
                            )}
                          </tr>
                        </thead> */}
                        <tbody>
                          {shouldShowOddEvenBreakdown && (
                            <tr>
                              <td className="numberGroup-drawingMatches mono">
                                {Object.keys(numberGroupOddEvenCount.even)
                                  .sort()
                                  .map(num => {
                                    return (
                                      <div className="matchesOddEvenContainer even">
                                        <span>{num}</span>
                                        <span>
                                          {numberGroupOddEvenCount.even[num]}
                                        </span>
                                      </div>
                                    );
                                  })}
                                {Object.keys(numberGroupOddEvenCount.odd)
                                  .sort()
                                  .map(num => {
                                    return (
                                      <div className="matchesOddEvenContainer odd">
                                        <span>{num}</span>
                                        <span>
                                          {numberGroupOddEvenCount.odd[num]}
                                        </span>
                                      </div>
                                    );
                                  })}
                              </td>
                            </tr>
                          )}
                          {!shouldShowOddEvenBreakdown &&
                            history.map((drawing, idx) => {
                              return (
                                <tr className="" key={idx}>
                                  <td className="numberGroup-drawingDate mono">
                                    {drawing.date}
                                  </td>
                                  <td className="numberGroup-drawingMatches mono">
                                    {drawing.matches.join(' ')}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
