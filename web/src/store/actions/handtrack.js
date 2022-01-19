import * as actionTypes from "./actionTypes";

export const changePredictions = (predictions) => ({
  type: actionTypes.CHANGE_PREDICTIONS,
  predictions,
});
