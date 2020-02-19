import React, {useContext} from 'react';
import AppContext from '../data/app-context';

import classNames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';

import './DrawingsHistory.css';

export default function DrawingsHistory({lookBack}) {
  const {
    state: {drawings, analytics},
    dispatch
  } = useContext(AppContext);

  const {drawingDateOverall} = analytics;

  return (
    <div>
      <h2>Thống kê kết quả</h2>
      {Object.keys(drawingDateOverall).map((ds, idx) => {
        if (lookBack && idx >= lookBack) {
          return null;
        }

        const {
          drawingResult: dsResult,
          numSets: dsNumSets
        } = drawingDateOverall[ds];
        return (
          <div key={idx} className="dsDrawingResultContainer">
            <h4>{ds}</h4>
            <div className="dsDrawing--numbers mono">
              {dsResult.map((num, idx) => {
                return (
                  <span key={idx} className="dsDrawing--num">
                    {num}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
