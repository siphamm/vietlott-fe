import React, {useCallback, useReducer} from 'react';
import {useParams} from 'react-router-dom';

import AppContext from './data/app-context';
import AppReducer from './data/app-reducer';
import {SET_DRAWINGS_DATA, TYPE_VIETLOTT645, CATEGORY_DATE} from './constants';

import SelectedDrawing from './components/SelectedDrawing';
import Loading from './components/Loading';
import CategoryPicker from './components/CategoryPicker';
import DrawingDatePicker from './components/DrawingDatePicker';
import useLatestData from './hooks/useLatestData';

import './App.css';

const initialState = {
  category: CATEGORY_DATE
};

function App() {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const {category, drawings} = state;
  const cb = useCallback(data => {
    const {analytics, drawings} = data;

    dispatch({
      type: SET_DRAWINGS_DATA,
      data: {
        drawings
      },
      analytics
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
        <div className="leftBar">
          <CategoryPicker />
          {category === CATEGORY_DATE && drawings && <DrawingDatePicker />}
        </div>
        <div className="mainBar">
          {category === CATEGORY_DATE && drawings && <SelectedDrawing />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
