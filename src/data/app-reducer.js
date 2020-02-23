import {
  SET_DRAWING_DATE,
  SET_DRAWINGS_DATA,
  SET_CATEGORY,
  SET_NUMBER_SET_FOR_ANALYSIS,
  SET_RECENT_DRAWINGS_LIMIT
} from '../constants';

const reducer = (state, action) => {
  const {type, data} = action;
  switch (type) {
    case SET_DRAWINGS_DATA:
      return {
        ...state,
        originalDrawings: data.originalDrawings || state.originalDrawings,
        drawings: data.drawings,
        selectedDrawingDate: data.drawings[0].drawingDate,
        analytics: data.analytics
      };
    case SET_DRAWING_DATE:
      return {
        ...state,
        selectedDrawingDate: data.drawingDate
      };
    case SET_CATEGORY:
      return {
        ...state,
        category: data.category
      };
    case SET_NUMBER_SET_FOR_ANALYSIS:
      return {
        ...state,
        selectedNumberSet: data.numberSet
      };
    case SET_RECENT_DRAWINGS_LIMIT:
      return {
        ...state,
        recentDrawingsLimit: data.recentDrawingsLimit
      };
    default:
      return state;
  }
};
export default reducer;