import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import {SET_DRAWING_DATE} from '../constants';
import './DrawingDatePicker.css';

export default function DrawingDatePicker() {
  const {state, dispatch} = useContext(AppContext);
  const {drawings, selectedDrawingDate} = state;

  return (
    <div className="drawingDatesPicker">
      {drawings.map((drawing, idx) => {
        return (
          <div
            className={classnames({
              drawingDate: true,
              mono: true,
              active: selectedDrawingDate === drawing.drawingDate
            })}
            key={`drawing${idx}`}
            onClick={() => {
              dispatch({
                type: SET_DRAWING_DATE,
                data: {drawingDate: drawing.drawingDate}
              });
            }}
          >
            {drawing.drawingDate}
          </div>
        );
      })}
    </div>
  );
}
