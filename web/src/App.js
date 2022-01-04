import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "./axios-api";
import openSocket from "socket.io-client";
import mqtt from "mqtt";

const connectUrl = `ws://broker.emqx.io:8083/mqtt`;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const topic = "mqtt/inclinometer/data";
const options = {
  transports: ["websocket", "polling", "flashsocket"],
};

const App = () => {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(null);
  const [mqttValue, setMqttValue] = useState("nothing");

  const [socketValue, setSocketValue] = useState("nothing");
  const [httpValue, setHttpValue] = useState("nothing");
  const [tcpValue, setTcpValue] = useState("nothing");

  useEffect(() => {
    // Websocket
    const socket = openSocket("http://192.168.1.131:8080/", options);
    socket.on("serverData", (data) => {
      if (data.action === "create") setSocketValue(data.rawData);
    });

    // MQTT
    setClient(mqtt.connect(connectUrl, { clientId }));

    // HTTP
    setInterval(() => {
      axios
        .get("/http-data")
        .then((res) => {
          if (res) {
            setHttpValue(res.data.rawData);
            // console.log("http-data res");
            // console.log(res.data.rawData);
          }
        })
        .catch((err) => console.log(err));
    }, 100);
    //   // }, 5.25);

    // TCP
    const socketTcp = openSocket("ws://192.168.1.131:1338/", options);
    socketTcp.on("serverDataTCP", (data) => {
      if (data.action === "create") setTcpValue(data.rawData);
    });
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        client.subscribe(topic, () => console.log(`Subscribe: '${topic}'`));
        setConnectStatus("Connected");
      });
      client.on("error", (err) => {
        console.error(`Connection error: ${err}`);
        client.end();
      });
      client.on("reconnect", () => setConnectStatus("Reconnecting"));

      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        // console.log(payload);
        setMqttValue(payload.message);
      });
    }
  }, [client]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Socket Value: {socketValue}</p>
        <p>MQTT Value: {mqttValue}</p>
        <p>TCP Value: {tcpValue}</p>
        <p>Http Value: {httpValue}</p>
        <p>
          connectionStatus: {connectStatus ? connectStatus.toString() : "n/n"}
        </p>
      </header>
    </div>
  );
};

export default App;
