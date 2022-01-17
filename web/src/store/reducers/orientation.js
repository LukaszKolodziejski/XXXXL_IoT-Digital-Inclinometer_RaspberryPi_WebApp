import * as actionTypes from "../actions/actionTypes";

const initialState = {
  socketValue: {
    transferTime: 0,
    angle: {
      X: 0,
      Y: 0,
      Z: 0,
    },
  },
};

const setSocketValue = (state, action) => ({
  ...state,
  socketValue: action.socketValue,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SOCKET_VALUE:
      return setSocketValue(state, action);
    default:
      return state;
  }
};

export default reducer;
