import React, { useState, useEffect, useCallback, useRef } from "react";
import openSocket from "socket.io-client";
import axios from "../../axios-api";
import mqtt from "mqtt";

import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import styles from "./Shipping.module.css";
import {
  CLIENT_ID,
  CONNECT_URL,
  TOPIC,
  OPTIONS,
} from "../../constants/protocols";
import { useDispatch, useSelector } from "react-redux";

import * as actions from "../../store/actions/index";

const NAMES = ["WebSocket", "HTTP", "MQTT", "TCP", "UDP"];

// >>>>>>>>>>>>>>>>>>>>>>>> New
const initData = {
  data: null,
  transferTime: 0,
  angle: {
    X: 0,
    Y: 0,
    Z: 0,
  },
};
// <<<<<<<<<<<<<<<<<<<<<<<<

const Shipping = React.memo((props) => {
  const [clientMqtt, setClientMqtt] = useState(null);
  const [connectStatus, setConnectStatus] = useState(null);
  const [socketValue, setSocketValue] = useState(initData);
  const [httpValue, setHttpValue] = useState(initData);
  const [mqttValue, setMqttValue] = useState(initData);
  const [tcpValue, setTcpValue] = useState(initData);
  const [udpValue, setUdpValue] = useState(initData);
  const [err, setErr] = useState(null);

  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );

  const activeWebsocketRef = useRef();
  const activeHTTPRef = useRef();
  const activeMQTTRef = useRef();
  const activeTCPRef = useRef();
  const activeUDPRef = useRef();

  useEffect(() => {
    activeWebsocketRef.current = options[0].active;
    activeHTTPRef.current = options[1].active;
    activeMQTTRef.current = options[2].active;
    activeTCPRef.current = options[3].active;
    activeUDPRef.current = options[4].active;
  }, [options]);

  const [syncTime, setSyncTime] = useState(0);
  const syncTimeRef = useRef();

  const dispatch = useDispatch();
  const onSocketValue = (data) => dispatch(actions.socketValueHandler(data));
  const onHttpValue = (data) => dispatch(actions.httpValueHandler(data));
  const onMqttValue = (data) => dispatch(actions.mqttValueHandler(data));
  const onTcpValue = (data) => dispatch(actions.tcpValueHandler(data));
  const onUdpValue = (data) => dispatch(actions.udpValueHandler(data));

  useEffect(() => {
    syncTimeRef.current = syncTime;
  });

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  useEffect(() => {
    console.log(options);
  }, [options]);

  const receivedDataHandler = useCallback(
    (proof) => {
      if (proof.rawData) {
        const { data, startTime } = proof.rawData;
        const endTime = new Date().getTime();
        const transferTime = endTime - startTime - syncTimeRef.current;
        // console.log("transferTime");
        // console.log(transferTime);

        const x = data.accel["x"];
        const y = data.accel["y"];
        const z = data.accel["z"];

        const angle_x =
          Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
        const angle_y =
          Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);
        const angle_z =
          Math.atan2(z, Math.sqrt(x * x + y * y)) / (Math.PI / 180);

        const angle = {
          X: angle_x,
          Y: angle_y,
          Z: angle_z,
        };

        return {
          data,
          angle,
          transferTime,
        };
      }
    },
    [syncTimeRef]
  );

  const protocolActiveHandler = useCallback(
    (protocol, cb) => {
      if (protocol === "WebSocket") if (activeWebsocketRef.current) cb();
      if (protocol === "HTTP") if (activeHTTPRef.current) cb();
      if (protocol === "MQTT") if (activeMQTTRef.current) cb();
      if (protocol === "TCP") if (activeTCPRef.current) cb();
      if (protocol === "UDP") if (activeUDPRef.current) cb();
    },
    [options, clientMqtt]
  );

  const bufferToReceivedDataHandler = (type, buffer) => {
    if (type === "tcp" || type === "mqtt") {
      const view = new Uint8Array(buffer);
      const stringData = new TextDecoder().decode(view);
      try {
        const rawData = JSON.parse(stringData);
        return receivedDataHandler({ rawData });
      } catch (e) {
        setErr(e);
        return null;
      }
    } else if (type === "udp") {
      const rawData = JSON.parse(buffer);
      return receivedDataHandler({ rawData });
    }
  };

  const timeSynchronizationHandler = (socket) => {
    socket.on("syncTime", (data) => {
      if (data.action === "sync") {
        const end = new Date().getTime();
        setSyncTime(end - data.start);
      }
    });
  };

  useEffect(() => {
    // Websocket
    const socket = openSocket("http://192.168.1.131:8080/", OPTIONS);
    timeSynchronizationHandler(socket);
    socket.on("serverData", (data) => {
      if (data.action === "create") {
        const protocol = () => onSocketValue(receivedDataHandler(data));
        protocolActiveHandler("WebSocket", protocol);
      }
    });

    // MQTT
    setClientMqtt(mqtt.connect(CONNECT_URL, { CLIENT_ID }));

    // HTTP
    setInterval(() => {
      axios
        .get("/http-data")
        .then((res) => {
          if (res) {
            const protocol = () => onHttpValue(receivedDataHandler(res.data));
            protocolActiveHandler("HTTP", protocol);
          }
        })
        // .catch((err) => console.log(err));
        .catch((err) => setErr(err));
    }, 20);

    // TCP
    const socketTcp = openSocket("ws://192.168.1.131:1338/", OPTIONS);
    socketTcp.on("serverDataTCP", ({ buffer }) => {
      const receivedData = bufferToReceivedDataHandler("tcp", buffer);
      const protocol = () => onTcpValue(receivedData);
      if (receivedData) protocolActiveHandler("TCP", protocol);
    });

    // UDP
    const socketUdp = openSocket("ws://192.168.1.131:5050/", OPTIONS);
    socketUdp.on("serverDataUDP", ({ buffer }) => {
      const receivedData = bufferToReceivedDataHandler("udp", buffer);
      const protocol = () => onUdpValue(receivedData);
      if (receivedData) protocolActiveHandler("UDP", protocol);
    });
  }, []);

  useEffect(() => {
    if (clientMqtt) {
      clientMqtt.on("connect", () => {
        const log = (topic) => console.log(`Subscribe: '${topic}'`);
        clientMqtt.subscribe(TOPIC[0], () => log(TOPIC[0]));
        clientMqtt.subscribe(TOPIC[1], () => log(TOPIC[1]));
        clientMqtt.subscribe(TOPIC[2], () => log(TOPIC[2]));
        clientMqtt.subscribe(TOPIC[3], () => log(TOPIC[3]));
        setConnectStatus("Connected");
      });
      clientMqtt.on("error", (err) => {
        console.error(`Connection error: ${err}`);
        clientMqtt.end();
      });
      clientMqtt.on("reconnect", () => setConnectStatus("Reconnecting"));

      clientMqtt.on("message", (TOPIC, message) => {
        const payload = {
          TOPIC,
          message: bufferToReceivedDataHandler("mqtt", message),
        };
        console.log(payload.TOPIC);
        const protocol = () => onMqttValue(payload.message);
        protocolActiveHandler("MQTT", protocol);
      });
    }
  }, [clientMqtt]);

  return (
    <div className={styles.Shipping}>
      <Options values={NAMES} onClick={clickOptionItemHandler} />
      <Chart kind="shipping" options={options} />
      <div></div>
      {/* <div></div> Suwak */}
    </div>
  );
});

export default Shipping;
