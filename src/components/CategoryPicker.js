import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import {SET_CATEGORY, CATEGORY_DATE, CATEGORY_NUMBER_SET} from '../constants';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendarAlt, faLayerGroup} from '@fortawesome/free-solid-svg-icons';

import './CategoryPicker.css';

export default function CategoryPicker() {
  const {dispatch} = useContext(AppContext);

  return (
    <div className="categoryPicker">
      <div
        className="category"
        onClick={() => {
          dispatch({
            type: SET_CATEGORY,
            data: {
              category: CATEGORY_DATE
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
      </div>
      <div
        className="category"
        onClick={() => {
          dispatch({
            type: SET_CATEGORY,
            data: {
              category: CATEGORY_NUMBER_SET
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faLayerGroup} />
      </div>
    </div>
  );
}
