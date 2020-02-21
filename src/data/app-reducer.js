import {
  SET_DRAWING_DATE,
  SET_DRAWINGS_DATA,
  SET_CATEGORY,
  SET_NUMBER_SET_FOR_ANALYSIS
} from '../constants';

const reducer = (state, action) => {
  const {type, data, analytics} = action;
  switch (type) {
    case SET_DRAWINGS_DATA:
      return {
        ...state,
        drawings: data.drawings,
        selectedDrawingDate: data.drawings[0].drawingDate,
        selectedNumberSet: 'N-1', // @TODO: this is not good
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
    case SET_NUMBER_SET_FOR_ANALYSIS:
      return {
        ...state,
        selectedNumberSet: data.numberSet
      };
    default:
      return state;
  }
};
export default reducer;
