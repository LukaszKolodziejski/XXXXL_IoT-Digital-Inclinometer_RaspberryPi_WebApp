import * as actionTypes from "./actionTypes";

export const socketValueHandler = (socketValue) => ({
  type: actionTypes.SOCKET_VALUE,
  socketValue,
});
