import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import classnames from 'classnames';

import {SET_NUMBER_SET_FOR_ANALYSIS} from '../constants';
import './NumberSetPicker.css';

export default function NumberSetPicker() {
  const {state, dispatch} = useContext(AppContext);
  const {analytics, selectedNumberSet} = state;
  const {numberSetOverall} = analytics;

  return (
    <div className="numberSetPicker">
      {Object.keys(numberSetOverall).map((numberSetKey, idx) => {
        return (
          <div
            className={classnames({
              numberSetOption: true,
              active: selectedNumberSet === numberSetKey
            })}
            key={`numberSet${idx}`}
            onClick={() => {
              dispatch({
                type: SET_NUMBER_SET_FOR_ANALYSIS,
                data: {numberSet: numberSetKey}
              });
            }}
          >
            {numberSetKey}
          </div>
        );
      })}
    </div>
  );
}
