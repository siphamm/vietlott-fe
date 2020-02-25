import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import {
  SET_CATEGORY,
  CATEGORY_DATE,
  CATEGORY_NUMBER_SET,
  CATEGORY_NUMBER_GROUP,
  CATEGORY_NUMBER_SET_GENERATOR,
  CATEGORY_NUMBER_MATRIX
} from '../constants';
import classnames from 'classnames';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faLayerGroup,
  faListOl,
  faMagic,
  faTable
} from '@fortawesome/free-solid-svg-icons';

import './CategoryPicker.css';

export default function CategoryPicker() {
  const {state, dispatch} = useContext(AppContext);
  const {category} = state;

  return (
    <div className="categoryPicker">
      <div
        className={classnames({
          category: true,
          active: category === CATEGORY_DATE
        })}
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
        className={classnames({
          category: true,
          active: category === CATEGORY_NUMBER_SET
        })}
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
      <div
        className={classnames({
          category: true,
          active: category === CATEGORY_NUMBER_GROUP
        })}
        onClick={() => {
          dispatch({
            type: SET_CATEGORY,
            data: {
              category: CATEGORY_NUMBER_GROUP
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faListOl} />
      </div>
      <div
        className={classnames({
          category: true,
          active: category === CATEGORY_NUMBER_SET_GENERATOR
        })}
        onClick={() => {
          dispatch({
            type: SET_CATEGORY,
            data: {
              category: CATEGORY_NUMBER_SET_GENERATOR
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faMagic} />
      </div>
      <div
        className={classnames({
          category: true,
          active: category === CATEGORY_NUMBER_MATRIX
        })}
        onClick={() => {
          dispatch({
            type: SET_CATEGORY,
            data: {
              category: CATEGORY_NUMBER_MATRIX
            }
          });
        }}
      >
        <FontAwesomeIcon icon={faTable} />
      </div>
    </div>
  );
}
