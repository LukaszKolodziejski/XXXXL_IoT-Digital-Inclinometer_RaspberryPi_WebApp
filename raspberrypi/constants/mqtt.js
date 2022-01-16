const clientId = () => `mqtt_${Math.random().toString(16).slice(3)}`;
const sample = (v) => Math.floor(Math.random() * v);

const CONNECT_URL = `mqtt://broker.hivemq.com:1883`;

const TOPIC = [
  "mqtt/inc/data0",
  "mqtt/inc/data1",
  "mqtt/inc/data2",
  "mqtt/inc/data3",
];

export { clientId, sample, CONNECT_URL, TOPIC };
