// import "./App.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Layout from "./hoc/Layout/Layout";
import axios from "./axios-api";
import openSocket from "socket.io-client";
import mqtt from "mqtt";
import { CLIENT_ID, CONNECT_URL, TOPIC, OPTIONS } from "./constants/constants";
import Orientation from "./containers/Orientation/Orientation";

const initData = {
  data: null,
  transferTime: 0,
  angle: {
    X: 0,
    Y: 0,
    Z: 0,
  },
};

const App = () => {
  // const [client, setClient] = useState(null);
  // const [connectStatus, setConnectStatus] = useState(null);
  // const [mqttValue, setMqttValue] = useState(initData);
  // const [udpValue, setUdpValue] = useState(initData);

  // const [tcpValue, setTcpValue] = useState(initData);
  // const [socketValue, setSocketValue] = useState(initData);
  // const [httpValue, setHttpValue] = useState(initData);
  // const [err, setErr] = useState(null);

  // const [syncTime, setSyncTime] = useState(0);
  // const syncTimeRef = useRef();

  // useEffect(() => {
  //   syncTimeRef.current = syncTime;
  // });

  // const receivedDataHandler = useCallback(
  //   (proof) => {
  //     if (proof.rawData) {
  //       const { data, startTime } = proof.rawData;
  //       const endTime = new Date().getTime();
  //       const transferTime = endTime - startTime - syncTimeRef.current;
  //       // console.log("transferTime");
  //       // console.log(transferTime);

  //       //TODO: raw data -> angle X Y Z
  //       const angle = {
  //         X: 0,
  //         Y: 0,
  //         Z: 0,
  //       };
  //       return {
  //         data,
  //         angle,
  //         transferTime,
  //       };
  //     }
  //   },
  //   [syncTimeRef]
  // );

  // const bufferToReceivedDataHandler = (type, buffer) => {
  //   if (type === "tcp" || type === "mqtt") {
  //     const view = new Uint8Array(buffer);
  //     const stringData = new TextDecoder().decode(view);
  //     try {
  //       const rawData = JSON.parse(stringData);
  //       return receivedDataHandler({ rawData });
  //     } catch (e) {
  //       setErr(e);
  //       return null;
  //     }
  //   } else if (type === "udp") {
  //     const rawData = JSON.parse(buffer);
  //     return receivedDataHandler({ rawData });
  //   }
  // };

  // const timeSynchronizationHandler = (socket) => {
  //   socket.on("syncTime", (data) => {
  //     if (data.action === "sync") {
  //       const end = new Date().getTime();
  //       setSyncTime(end - data.start);
  //     }
  //   });
  // };
  // //TODO: raspberry -> constants/ Z dużej litery
  // useEffect(() => {
  //   // Websocket
  //   const socket = openSocket("http://192.168.1.131:8080/", OPTIONS);

  //   timeSynchronizationHandler(socket);

  //   socket.on("serverData", (data) => {
  //     if (data.action === "create") setSocketValue(receivedDataHandler(data));
  //   });

  //   // MQTT
  //   setClient(mqtt.connect(CONNECT_URL, { CLIENT_ID }));

  //   // HTTP
  //   setInterval(() => {
  //     axios
  //       .get("/http-data")
  //       .then((res) => {
  //         if (res) {
  //           setHttpValue(receivedDataHandler(res.data));
  //         }
  //       })
  //       // .catch((err) => console.log(err));
  //       .catch((err) => setErr(err));
  //   }, 20);

  //   // TCP
  //   const socketTcp = openSocket("ws://192.168.1.131:1338/", OPTIONS);
  //   socketTcp.on("serverDataTCP", ({ buffer }) => {
  //     const receivedData = bufferToReceivedDataHandler("tcp", buffer);
  //     if (receivedData) setTcpValue(receivedData);
  //   });

  //   // UDP
  //   const socketUdp = openSocket("ws://192.168.1.131:5050/", OPTIONS);
  //   socketUdp.on("serverDataUDP", ({ buffer }) => {
  //     const receivedData = bufferToReceivedDataHandler("udp", buffer);
  //     if (receivedData) setUdpValue(receivedData);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (client) {
  //     client.on("connect", () => {
  //       client.subscribe(TOPIC, () => console.log(`Subscribe: '${TOPIC}'`));
  //       setConnectStatus("Connected");
  //     });
  //     client.on("error", (err) => {
  //       console.error(`Connection error: ${err}`);
  //       client.end();
  //     });
  //     client.on("reconnect", () => setConnectStatus("Reconnecting"));

  //     client.on("message", (TOPIC, message) => {
  //       const payload = {
  //         TOPIC,
  //         message: bufferToReceivedDataHandler("mqtt", message),
  //       };
  //       // console.log(payload);
  //       setMqttValue(payload.message);
  //     });
  //   }
  // }, [client]);

  return (
    <Router>
      <Layout>
        <Route path="/" component={Orientation} exact />
      </Layout>
    </Router>
  );
};
{
}
{
}

{
  /* <div className="App">
<header className="App-header"> */
}
{
  /* <p>Socket Value: {socketValue.data}</p> */
}
{
  /* <p>Socket Trans Time: {socketValue.transferTime}</p>
<p>------------------</p>
{/* <p>MQTT Value: {mqttValue.data}</p> */
}
{
  /* <p>MQTT Trans Time: {mqttValue.transferTime}</p> */
}
{
  /* <p>------------------</p> */
}
{
  /* <p>TCP Value: {tcpValue.data}</p> */
}
{
  /* <p>TCP Trans Time: {tcpValue.transferTime}</p> */
}
{
  /* <p>------------------</p> */
}
{
  /* <p>UDP Value: {udpValue.data}</p> */
}
{
  /* <p>UDP Trans Time: {udpValue.transferTime}</p> */
}
{
  /* <p>------------------</p> */
}
{
  /* <p>Http Value: {httpValue.data}</p> */
}
{
  /* <p>Http Trans Time: {httpValue.transferTime}</p> */
}
{
  /* <p>
  connectionStatus: {connectStatus ? connectStatus.toString() : "n/n"}
</p> */
}
{
  /* </header>
</div> */
}
export default App;
