import * as actionTypes from "../actions/actionTypes";

const initialState = {
  httpValue: {
    data: null,
    transferTime: 0,
    angle: {
      X: 0,
      Y: 0,
      Z: 0,
    },
  },
  mqttValue: {
    data: null,
    transferTime: 0,
    angle: {
      X: 0,
      Y: 0,
      Z: 0,
    },
  },
  tcpValue: {
    data: null,
    transferTime: 0,
    angle: {
      X: 0,
      Y: 0,
      Z: 0,
    },
  },
  udpValue: {
    data: null,
    transferTime: 0,
    angle: {
      X: 0,
      Y: 0,
      Z: 0,
    },
  },
};

const setHttpValue = (state, action) => ({
  ...state,
  httpValue: action.httpValue,
});
const setMqttValue = (state, action) => ({
  ...state,
  mqttValue: action.mqttValue,
});
const setTcpValue = (state, action) => ({
  ...state,
  tcpValue: action.tcpValue,
});
const setUdpValue = (state, action) => ({
  ...state,
  udpValue: action.udpValue,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.HTTP_VALUE:
      return setHttpValue(state, action);
    case actionTypes.MQTT_VALUE:
      return setMqttValue(state, action);
    case actionTypes.TCP_VALUE:
      return setTcpValue(state, action);
    case actionTypes.UDP_VALUE:
      return setUdpValue(state, action);
    default:
      return state;
  }
};

export default reducer;
