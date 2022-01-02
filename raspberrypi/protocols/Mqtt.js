import mqtt from "mqtt";

let client;

export default {
  init: (connectUrl, options) => {
    client = mqtt.connect(connectUrl, options);
    return client;
  },
  getClient: () => {
    if (!client) throw new Error("MQTT not initialized!");
    return client;
  },
};
