// MQTT
const CLIENT_ID = `mqtt_${Math.random().toString(16).slice(3)}`;
const CONNECT_URL = `ws://broker.hivemq.com:8000/mqtt`;

const TOPIC = [
  "mqtt/inc/data0",
  "mqtt/inc/data1",
  "mqtt/inc/data2",
  "mqtt/inc/data3",
];

// Websocket
const OPTIONS = {
  transports: ["websocket", "polling", "flashsocket"],
};

export { CLIENT_ID, CONNECT_URL, TOPIC, OPTIONS };
