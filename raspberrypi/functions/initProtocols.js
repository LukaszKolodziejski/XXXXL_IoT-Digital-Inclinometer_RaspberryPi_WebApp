import Socket from "../protocols/Socket";
import Mqtt from "../protocols/Mqtt";
import Http from "../protocols/Http";
import Tcp from "../protocols/Tcp";
import { connectUrl, clientId } from "../constants/mqtt";

const initProtocols = () => {
  // Http
  Http.init(8000);

  // Websocket
  const io = Socket.init(8080);
  io.on("connection", (socket) => {
    console.log("Client connected");
  });

  // // MQTT
  Mqtt.init(connectUrl, { clientId });

  // TCP
  Tcp.init(1337);
};

export { initProtocols };