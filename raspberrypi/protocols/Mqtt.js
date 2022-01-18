import mqtt from "mqtt";
import { clientId, sample } from "../constants/mqtt";

const client = [];

export default {
  init: (connectUrl) => {
    for (let k = 0; k <= 100; k++)
      client.push(mqtt.connect(connectUrl, { clientId: clientId() }));
    return client;
  },
  getClient: () => {
    const j = sample(100);
    if (!client[j]) throw new Error("MQTT not initialized!");
    return client[j];
  },
};
