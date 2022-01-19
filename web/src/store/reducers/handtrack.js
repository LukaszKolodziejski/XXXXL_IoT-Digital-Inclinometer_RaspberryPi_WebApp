import * as actionTypes from "../actions/actionTypes";

const initialState = {
  predictions: [],
};

const changePredictions = (state, action) => ({
  ...state,
  predictions: action.predictions,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_PREDICTIONS:
      return changePredictions(state, action);
    default:
      return state;
  }
};

export default reducer;
