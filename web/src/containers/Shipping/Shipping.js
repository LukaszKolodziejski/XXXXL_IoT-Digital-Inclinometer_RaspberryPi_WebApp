import React, { useState, useEffect, useCallback, useRef } from "react";

import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import styles from "./Shipping.module.css";
import { useSelector, useDispatch } from "react-redux";
import { countAnglesHandler } from "../../utils/utils";

import * as actions from "../../store/actions/index";

const NAMES = ["WebSocket", "HTTP", "MQTT", "TCP", "UDP"];

const Shipping = React.memo((props) => {
  const [err, setErr] = useState(null);

  const websocketRawData = useSelector(
    (state) => state.protocols.websocket.rawData
  );
  const httpRawData = useSelector((state) => state.protocols.http.rawData);
  const clientMqtt = useSelector((state) => state.protocols.mqtt.client);
  const messageMqtt = useSelector((state) => state.protocols.mqtt.message);
  const tcpRawData = useSelector((state) => state.protocols.tcp.buffer);
  const udpRawData = useSelector((state) => state.protocols.udp.buffer);
  const syncTime = useSelector((state) => state.protocols.websocket.syncTime);

  const [options, setOptions] = useState(
    NAMES.map((name) => ({ text: name, active: false }))
  );

  const activeWebsocketRef = useRef();
  const activeHTTPRef = useRef();
  const activeMQTTRef = useRef();
  const activeTCPRef = useRef();
  const activeUDPRef = useRef();

  const dispatch = useDispatch();
  const onSocketValue = (data) => dispatch(actions.socketValueHandler(data));
  const onHttpValue = (data) => dispatch(actions.httpValueHandler(data));
  const onMqttValue = (data) => dispatch(actions.mqttValueHandler(data));
  const onTcpValue = (data) => dispatch(actions.tcpValueHandler(data));
  const onUdpValue = (data) => dispatch(actions.udpValueHandler(data));
  const onGetMqttMessage = (client) => dispatch(actions.getMqttMessage(client));

  useEffect(() => {
    activeWebsocketRef.current = options[0].active;
    activeHTTPRef.current = options[1].active;
    activeMQTTRef.current = options[2].active;
    activeTCPRef.current = options[3].active;
    activeUDPRef.current = options[4].active;
  }, [options]);

  const clickOptionItemHandler = (option, active) => {
    const newOptions = options.map((opt) =>
      opt.text === option ? { ...opt, active } : opt
    );
    setOptions(newOptions);
  };

  const receivedDataHandler = useCallback(
    (proof) => {
      if (proof.rawData) {
        const { data, startTime } = proof.rawData;
        const endTime = new Date().getTime();
        const transferTime = endTime - startTime - syncTime;
        const angle = countAnglesHandler(data);
        // console.log("transferTime");
        // console.log(transferTime);

        return {
          angle,
          transferTime,
        };
      }
    },
    [syncTime]
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

  // Websocket
  useEffect(() => {
    protocolActiveHandler("WebSocket", () =>
      onSocketValue(receivedDataHandler(websocketRawData))
    );
  }, [websocketRawData]);

  // HTTP
  useEffect(() => {
    const protocol = () => onHttpValue(receivedDataHandler(httpRawData.data));
    protocolActiveHandler("HTTP", protocol);
  }, [httpRawData]);

  // MQTT
  useEffect(() => {
    const message = bufferToReceivedDataHandler("mqtt", messageMqtt);
    const protocol = () => onMqttValue(message);
    protocolActiveHandler("MQTT", protocol);
  }, [messageMqtt]);

  useEffect(() => {
    onGetMqttMessage(clientMqtt);
  }, [clientMqtt]);

  // TCP
  useEffect(() => {
    const receivedData = bufferToReceivedDataHandler("tcp", tcpRawData);
    const protocol = () => onTcpValue(receivedData);
    if (receivedData) protocolActiveHandler("TCP", protocol);
  }, [tcpRawData]);

  // UDP
  useEffect(() => {
    const receivedData = bufferToReceivedDataHandler("udp", udpRawData);
    const protocol = () => onUdpValue(receivedData);
    if (receivedData) protocolActiveHandler("UDP", protocol);
  }, [udpRawData]);

  return (
    <div className={styles.Shipping}>
      <Options values={NAMES} onClick={clickOptionItemHandler} />
      <Chart kind="shipping" options={options} />
      <div></div>
    </div>
  );
});

export default Shipping;
