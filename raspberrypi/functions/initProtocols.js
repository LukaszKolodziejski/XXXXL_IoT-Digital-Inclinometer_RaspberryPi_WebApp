import Socket from "../protocols/Socket";
import Mqtt from "../protocols/Mqtt";
import Http from "../protocols/Http";
import { connectUrl, clientId } from "../constants/mqtt";

const initProtocols = () => {
  // Http
  Http.init();

  // Websocket
  const io = Socket.init(Http.getServer());
  io.on("connection", (socket) => {
    console.log("Client connected");
  });

  // MQTT
  Mqtt.init(connectUrl, { clientId });
};

export { initProtocols };
