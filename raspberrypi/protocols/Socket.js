import Server from "./Http";

let io;

export default {
  init: (port) => {
    const server = Server.init(port);
    io = require("socket.io")(server);
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  },
};
