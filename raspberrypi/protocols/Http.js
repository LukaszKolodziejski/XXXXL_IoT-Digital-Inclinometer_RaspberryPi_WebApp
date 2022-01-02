import express from "express";

let server;
let rawData;

export default {
  init: () => {
    const app = express();
    const port = process.env.PORT || 8080;

    // Express
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      next();
    });
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((err, req, res, next) => {
      res.status(500).send({ message: err.message });
    });

    app.get("/http-data", (req, res) => {
      if (rawData) res.send({ rawData });
    });

    server = app.listen(port, () => {
      console.log(`Serve at http://localhost:${port}`);
    });

    return server;
  },
  getServer: () => {
    if (!server) throw new Error("Http server not initialized!");
    return server;
  },
  setRawData: (data) => {
    rawData = data;
    return rawData;
  },
};
