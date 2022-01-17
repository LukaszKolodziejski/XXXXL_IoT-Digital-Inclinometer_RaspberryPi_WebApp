import * as actionTypes from "../actions/actionTypes";

const initialState = {
  syncTime: 0,
  websocket: {
    socket: null,
    rawData: {},
  },
  http: {
    rawData: {},
  },
  mqtt: {
    client: null,
    topic: null,
    message: null,
  },
  tcp: {
    buffer: null,
  },
  udp: {
    buffer: null,
  },
};

const websocketInit = (state, action) => ({
  ...state,
  websocket: {
    ...state.websocket,
    socket: action.socket,
  },
});

const getHttpData = (state, action) => ({
  ...state,
  http: {
    rawData: action.rawData,
  },
});

const timeSynchronization = (state, action) => ({
  ...state,
  syncTime: action.syncTime,
});

const getWebsocketData = (state, action) => ({
  ...state,
  websocket: {
    ...state.websocket,
    rawData: action.rawData,
  },
});

const getTcpData = (state, action) => ({
  ...state,
  tcp: {
    buffer: action.buffer,
  },
});

const getUdpData = (state, action) => ({
  ...state,
  udp: {
    buffer: action.buffer,
  },
});

const mqttInit = (state, action) => ({
  ...state,
  mqtt: {
    ...state.mqtt,
    client: action.client,
  },
});

const getMqttMessage = (state, action) => ({
  ...state,
  mqtt: {
    ...state.mqtt,
    topic: action.topic,
    message: action.message,
  },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TIME_SYNC:
      return timeSynchronization(state, action);

    case actionTypes.GET_WEBSOCKET_RAW_DATA:
      return getWebsocketData(state, action);
    case actionTypes.WEBSOCKET_INIT:
      return websocketInit(state, action);

    case actionTypes.GET_HTTP_RAW_DATA:
      return getHttpData(state, action);
    case actionTypes.GET_TCP_RAW_DATA:
      return getTcpData(state, action);
    case actionTypes.GET_UDP_RAW_DATA:
      return getUdpData(state, action);

    case actionTypes.MQTT_INIT:
      return mqttInit(state, action);
    case actionTypes.GET_MQTT_MESSAGE:
      return getMqttMessage(state, action);

    default:
      return state;
  }
};

export default reducer;
