import React, {useContext} from 'react';
import AppContext from '../data/app-context';
import {
  SET_CATEGORY,
  CATEGORY_DATE,
  CATEGORY_NUMBER_SET,
  CATEGORY_NUMBER_GROUP,
  CATEGORY_NUMBER_SET_GENERATOR,
  CATEGORY_NUMBER_MATRIX,
  CATEGORY_CUSTOM_NUMBER_SET
} from '../constants';
import classnames from 'classnames';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faLayerGroup,
  faListOl,
  faMagic,
  faTable,
  faHistory
} from '@fortawesome/free-solid-svg-icons';

import './CategoryPicker.css';

export default function CategoryPicker() {
  const {state, dispatch} = useContext(AppContext);
  const {category} = state;
  const categories = [
    {
      name: CATEGORY_DATE,
      icon: faCalendarAlt
    },
    {
      name: CATEGORY_NUMBER_SET,
      icon: faLayerGroup
    },
    {
      name: CATEGORY_CUSTOM_NUMBER_SET,
      icon: faHistory
    },
    {
      name: CATEGORY_NUMBER_GROUP,
      icon: faListOl
    },
    {
      name: CATEGORY_NUMBER_SET_GENERATOR,
      icon: faMagic
    },
    {
      name: CATEGORY_NUMBER_MATRIX,
      icon: faTable
    }
  ];

  return (
    <div className="categoryPicker">
      {categories.map(cat => {
        const {name, icon} = cat;
        return (
          <div
            className={classnames({
              category: true,
              active: name === category
            })}
            onClick={() => {
              dispatch({
                type: SET_CATEGORY,
                data: {
                  category: name
                }
              });
            }}
          >
            <FontAwesomeIcon icon={icon} />
          </div>
        );
      })}
    </div>
  );
}
