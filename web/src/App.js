import "./App.css";
import React, { useEffect } from "react";
import axios from "./axios-api";
import openSocket from "socket.io-client";

const App = () => {
  useEffect(() => {
    openSocket("http://192.168.1.131:8080/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    axios.get("/").then((res) => {
      console.log(res.data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
};

export default App;
