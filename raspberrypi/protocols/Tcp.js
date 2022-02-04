import Net from "net";
import Server from "./Http";

let serverSocketTcp;

export default {
  init: (port) => {
    // Server TCP
    let streamTcp;

    const portTCP = port;
    const hostTCP = "192.168.1.131";
    const clientIP = "192.168.1.187";

    const serverTCP = Net.createServer((socket) => {
      serverSocketTcp = socket;
      socket.write("1 Echo serverTCP\r\n");
      socket.pipe(socket);
    });

    serverTCP.on("listening", () => {
      console.log("server TCP is running");
    });

    serverTCP.on("connection", (stream) => {
      const server = Server.init(1338);
      streamTcp = require("socket.io")(server);
      stream.write("stream Echo serverTCP");
    });

    serverTCP.listen(portTCP, hostTCP);

    // Client TCP
    const clientTCP = new Net.Socket();
    clientTCP.connect(portTCP, hostTCP, () => {
      clientTCP.write("Client TCP is Connected");
    });

    clientTCP.on("data", (buffer) => {
      // console.log("Received: " + buffer);
      streamTcp.emit("serverDataTCP", { buffer });
    });

    return serverSocketTcp;
  },
  getSocket: () => {
    if (!serverSocketTcp) throw new Error("Server Socket Tcp not initialized!");
    return serverSocketTcp;
  },
};
