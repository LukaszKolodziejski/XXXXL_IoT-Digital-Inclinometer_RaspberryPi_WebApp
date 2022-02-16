import Netcat from "node-netcat";
import Server from "./Http";

let socketPort;
let socketStreamUdp;

export default {
  init: (port) => {
    const server = Netcat.udpServer(port, "192.168.1.131");
    socketPort = port;
    let streamUdp;

    server.on("data", (buffer, client, protocol) => {
      streamUdp.emit("serverDataUDP", {
        action: "create",
        buffer,
      });
    });

    server.on("ready", () => {
      console.log("ready");
      const server = Server.init(5050);
      streamUdp = require("socket.io")(server);
    });

    server.once("error", (err) => {
      console.log(err);
    });

    server.once("close", () => {
      console.log("close");
    });

    server.bind();

    return socketPort;
  },
  initStream: () => {
    const client = Netcat.udpClient(socketPort, "192.168.1.131");
    socketStreamUdp = client;

    client.on("open", () => {
      console.log("open");
    });

    client.once("error", (err) => {
      console.error("err");
    });

    client.once("close", () => {
      console.log("client, closed");
    });
    return socketStreamUdp;
  },
  getSocket: () => {
    if (!socketStreamUdp) throw new Error("Server Socket Udp not initialized!");
    return socketStreamUdp;
  },
};
