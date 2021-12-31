import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "./axios-api";
import openSocket from "socket.io-client";

const App = () => {
  const [socketValue, setSocketValue] = useState("nothing");
  const [httpValue, setHttpValue] = useState("nothing");

  useEffect(() => {
    // Websocket
    const socket = openSocket("http://192.168.1.131:8080/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("serverData", (data) => {
      console.log("socket działa 1");
      if (data.action === "create") {
        console.log("socket działa 2");
        setSocketValue(data.value);
      }
    });

    // Http
    axios.get("/").then((res) => {
      console.log(res.data);
    });
    setInterval(() => {
      axios.get("/http-data").then((res) => {
        if (res) {
          setHttpValue(res.data.value);
          console.log("http-data res");
          console.log(res.data.value);
        }
      }, 200);
      // }, 5.25);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>SocketValue: {socketValue}</p>
        <p>HttpValue: {httpValue}</p>
      </header>
    </div>
  );
};

export default App;
