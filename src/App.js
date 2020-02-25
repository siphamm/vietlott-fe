import React, {useCallback, useReducer} from 'react';
import {useParams} from 'react-router-dom';

import AppContext from './data/app-context';
import AppReducer from './data/app-reducer';
import {
  SET_DRAWINGS_DATA,
  TYPE_VIETLOTT645,
  CATEGORY_DATE,
  CATEGORY_NUMBER_SET,
  CATEGORY_NUMBER_GROUP,
  CATEGORY_NUMBER_SET_GENERATOR,
  CATEGORY_NUMBER_MATRIX
} from './constants';

import SelectedDrawing from './components/SelectedDrawing';
import Loading from './components/Loading';
import CategoryPicker from './components/CategoryPicker';
import DrawingDatePicker from './components/DrawingDatePicker';
import NumberSetAnalysis from './components/NumberSetAnalysis';
import NumberSetPicker from './components/NumberSetPicker';
import NumberGroupAnalysis from './components/NumberGroupAnalysis';
import RecentDrawingsLimit from './components/RecentDrawingsLimit';
import NumberSetGenerator from './components/NumberSetGenerator';
import NumberMatrix from './components/NumberMatrix';

import useLatestData from './hooks/useLatestData';

import './App.css';

const initialState = {
  category: CATEGORY_DATE,
  selectedNumberSet: 'N-1' // @TODO: this is not good. hardcoded
};

function App() {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const {category, drawings} = state;
  const cb = useCallback(data => {
    const {analytics, drawings, originalDrawings} = data;

    dispatch({
      type: SET_DRAWINGS_DATA,
      data: {
        originalDrawings,
        drawings,
        analytics
      }
    });
  }, []);

  const {type = TYPE_VIETLOTT645} = useParams();
  useLatestData(type, cb);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <div className="App">
        {!drawings && <Loading />}
        {drawings && (
          <>
            <div className="leftBar">
              <CategoryPicker />
              {category === CATEGORY_DATE && <DrawingDatePicker />}
              {category === CATEGORY_NUMBER_SET && <NumberSetPicker />}
            </div>
            <div className="mainBar">
              {category !== CATEGORY_NUMBER_SET_GENERATOR && (
                <RecentDrawingsLimit />
              )}
              {category === CATEGORY_DATE && <SelectedDrawing />}
              {category === CATEGORY_NUMBER_SET && <NumberSetAnalysis />}
              {category === CATEGORY_NUMBER_GROUP && <NumberGroupAnalysis />}
              {category === CATEGORY_NUMBER_SET_GENERATOR && (
                <NumberSetGenerator />
              )}
              {category === CATEGORY_NUMBER_MATRIX && <NumberMatrix />}
            </div>
          </>
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
