import React, {useContext, useRef} from 'react';
import AppContext from '../data/app-context';
import {SET_RECENT_DRAWINGS_LIMIT, SET_DRAWINGS_DATA} from '../constants';
import stats from '../lib/analytics';
import './RecentDrawingsLimit.css';

export default function RecentDrawingsLimit() {
  const {state, dispatch} = useContext(AppContext);
  const inputEl = useRef(null);

  const {analytics, originalDrawings, recentDrawingsLimit} = state;
  return (
    <form
      className="recentDrawingsLimit"
      onSubmit={evt => {
        evt.preventDefault();
        let newLimit = parseInt((inputEl.current.value || '').trim(), 10);

        dispatch({
          type: SET_RECENT_DRAWINGS_LIMIT,
          data: {
            recentDrawingsLimit: parseInt(newLimit, 10)
          }
        });

        const newDrawings = newLimit
          ? originalDrawings.slice(0, newLimit)
          : originalDrawings;

        const newAnalytics = stats(newDrawings, {
          allPossibleNumbers: analytics.metadata.allPossibleNumbers
        });

        dispatch({
          type: SET_DRAWINGS_DATA,
          data: {
            originalDrawings,
            drawings: newDrawings,
            analytics: newAnalytics
          }
        });
      }}
    >
      <input
        type="number"
        placeholder="Giới hạn số lần quay"
        min="2"
        defaultValue={recentDrawingsLimit || ''}
        ref={inputEl}
      />
      <button>Set</button>
    </form>
  );
}
