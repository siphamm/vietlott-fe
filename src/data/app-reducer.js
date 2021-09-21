import {
  SET_DRAWING_DATE,
  SET_DRAWINGS_DATA,
  SET_CATEGORY,
  SET_NUMBER_SET_FOR_ANALYSIS,
  SET_RECENT_DRAWINGS_LIMIT,
  SET_ANALYTICS,
  SET_ORIGINAL_ANALYTICS,
  GET_DATA
} from '../constants';

const reducer = (state, action) => {
  const {type, data} = action;
  switch (type) {
    case GET_DATA:
      return {...state, drawings: undefined, analytics: undefined};

    case SET_DRAWINGS_DATA:
      return {
        ...state,
        originalDrawings: data.originalDrawings || state.originalDrawings,
        drawings: data.drawings
      };
    case SET_ANALYTICS:
      return {
        ...state,
        analytics: data.analytics
      };
    case SET_ORIGINAL_ANALYTICS:
      return {
        ...state,
        originalAnalytics: data.originalAnalytics
      };
    case SET_DRAWING_DATE:
      return {
        ...state,
        selectedDrawingDate: data.drawingDate,
        selectedDrawingId: data.drawingId
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
