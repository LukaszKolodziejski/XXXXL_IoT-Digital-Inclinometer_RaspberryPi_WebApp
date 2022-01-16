import * as actionTypes from "./actionTypes";

export const httpValueHandler = (httpValue) => ({
  type: actionTypes.HTTP_VALUE,
  httpValue,
});
export const mqttValueHandler = (mqttValue) => ({
  type: actionTypes.MQTT_VALUE,
  mqttValue,
});
export const tcpValueHandler = (tcpValue) => ({
  type: actionTypes.TCP_VALUE,
  tcpValue,
});
export const udpValueHandler = (udpValue) => ({
  type: actionTypes.UDP_VALUE,
  udpValue,
});
