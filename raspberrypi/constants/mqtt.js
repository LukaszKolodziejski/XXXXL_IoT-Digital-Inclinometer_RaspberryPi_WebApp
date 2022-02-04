const clientId = () => `mqtt_${Math.random().toString(16).slice(3)}`;
const sample = (v) => Math.floor(Math.random() * v);

// MQTT Publish
const CONNECT_URL = `mqtt://broker.hivemq.com:1883`;
const TOPIC = "mqtt/inc/data0";

export { clientId, sample, CONNECT_URL, TOPIC };
