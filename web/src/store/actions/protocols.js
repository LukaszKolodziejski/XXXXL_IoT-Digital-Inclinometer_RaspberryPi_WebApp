import openSocket from "socket.io-client";
import mqtt from "mqtt";

import axios from "../../axios-api";
import * as actionTypes from "./actionTypes";

import {
  CLIENT_ID,
  CONNECT_URL,
  TOPIC,
  OPTIONS,
} from "../../constants/protocols";

const timeSynchronization = (socket) => (dispatch) => {
  socket.on("syncTime", (data) => {
    if (data.action === "sync") {
      const end = new Date().getTime();
      dispatch({
        type: actionTypes.TIME_SYNC,
        syncTime: end - data.start,
      });
    }
  });
};

const getWebsocketData = (socket) => (dispatch) => {
  socket.on("serverData", (data) => {
    if (data.action === "create") {
      dispatch({
        type: actionTypes.GET_WEBSOCKET_RAW_DATA,
        rawData: data,
      });
    }
  });
};

// Redux-Thunk
export const websocketInit = () => async (dispatch) => {
  const socket = await openSocket("http://192.168.1.131:8080/", OPTIONS);

  dispatch({ type: actionTypes.WEBSOCKET_INIT, socket });
  dispatch(timeSynchronization(socket));
  dispatch(getWebsocketData(socket));
};

// TCP
export const tcpInit = () => async (dispatch) => {
  const socketTcp = await openSocket("ws://192.168.1.131:1338/", OPTIONS);
  socketTcp.on("serverDataTCP", ({ buffer }) => {
    dispatch({
      type: actionTypes.GET_TCP_RAW_DATA,
      buffer,
    });
  });
};

//UDP
export const udpInit = () => async (dispatch) => {
  const socketUdp = await openSocket("ws://192.168.1.131:5050/", OPTIONS);
  socketUdp.on("serverDataUDP", ({ buffer }) => {
    dispatch({
      type: actionTypes.GET_UDP_RAW_DATA,
      buffer,
    });
  });
};

// HTTP
export const httpInit = () => async (dispatch) => {
  setInterval(() => {
    axios
      .get("/http-data")
      .then((res) => {
        if (res) {
          dispatch({
            type: actionTypes.GET_HTTP_RAW_DATA,
            rawData: res,
          });
        }
      })
      .catch((err) => console.log(err));
  }, 20);
};

// MQTT
export const mqttInit = () => async (dispatch) => {
  const client = await mqtt.connect(CONNECT_URL, { CLIENT_ID });
  client.on("connect", () => {
    const log = (topic) => console.log(`Subscribe: '${topic}'`);
    client.subscribe(TOPIC, () => log(TOPIC));
  });
  client.on("error", (err) => {
    console.error(`Connection error: ${err}`);
    client.end();
  });

  client.on("message", (topic, message) => {
    dispatch({
      type: actionTypes.GET_MQTT_MESSAGE,
      topic,
      message,
    });
  });

  dispatch({
    type: actionTypes.MQTT_INIT,
    client,
  });
};
