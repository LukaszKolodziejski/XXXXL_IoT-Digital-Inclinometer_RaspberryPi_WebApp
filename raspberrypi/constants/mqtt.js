const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `mqtt://broker.emqx.io:1883`;
// const connectUrl = `mqtt://broker.hivemq.com:1883`;
const topic = "mqtt/inclinometer/data";

export { clientId, connectUrl, topic };
