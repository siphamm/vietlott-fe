import {SET_DRAWING_DATE, SET_DRAWINGS_DATA, SET_CATEGORY} from '../constants';

const reducer = (state, action) => {
  const {type, data, analytics} = action;
  switch (type) {
    case SET_DRAWINGS_DATA:
      return {
        ...state,
        drawings: data.drawings,
        selectedDrawingDate: data.drawings[0].drawingDate,
        analytics
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
    default:
      return state;
  }
};
export default reducer;
