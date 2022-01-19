import React, { useState, useEffect, useCallback, useRef } from "react";
import { Redirect } from "react-router-dom";

import Options from "../../components/Options/Options";
import Chart from "../../components/Chart/Chart";
import Modifier from "../../components/Modifier/Modifier";

import styles from "./Transfer.module.css";
import { useSelector, useDispatch } from "react-redux";
import { countAnglesHandler } from "../../utils/utils";
import * as actions from "../../store/actions/index";

const NAMES = ["WebSocket", "HTTP", "MQTT", "TCP", "UDP"];

const Transfer = React.memo((props) => {
  const [err, setErr] = useState(null);
  const [optionsIndex, setOptionsIndex] = useState(0);
  const [isPredict, setIsPredict] = useState(false);
  const [approx, setApprox] = useState(20);
  const [redirect, setRedirect] = useState("");

  const websocketRawData = useSelector(
    (state) => state.protocols.websocket.rawData
  );
  const httpRawData = useSelector((state) => state.protocols.http.rawData);
  const messageMqtt = useSelector((state) => state.protocols.mqtt.message);
  const tcpRawData = useSelector((state) => state.protocols.tcp.buffer);
  const udpRawData = useSelector((state) => state.protocols.udp.buffer);
  const syncTime = useSelector((state) => state.protocols.syncTime);
  const predictions = useSelector((state) => state.handtrack.predictions);

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
    [options]
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
  useEffect(() => {
    const findPredict = predictions.find((pred) => pred.label === "face");
    setIsPredict(findPredict ? true : false);
    if (predictions) {
      const pred = predictions
        .filter((pred) => pred.label !== "face")
        .sort((a, b) => (a.bbox[0] > b.bbox[0] && 1) || -1);

      if (pred.length === 1) {
        const optLength = options.length;
        const hand = pred[0];
        if (hand.label === "open") {
          setOptionsIndex((prev) => (prev < optLength - 1 ? prev + 1 : 0));
        } else if (hand.label === "point") {
          setOptions((prevOptions) => {
            const copyPrevOptions = [...prevOptions];
            copyPrevOptions[optionsIndex].active =
              hand.bbox[0] < 250 ? true : false;
            return copyPrevOptions;
          });
        }
      } else if (pred.length === 2) {
        const leftHand = pred[0].label;
        const rightHand = pred[1].label;
        setTimeout(() => {
          if (leftHand === "open" && rightHand === "closed") {
            setRedirect("/");
          } else if (leftHand === "closed" && rightHand === "open")
            setRedirect("/shipping");
        }, 700);
      }
    }
  }, [predictions]);

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

  if (redirect) return <Redirect to={redirect} />;

  return (
    <div className={styles.Transfer}>
      <Options
        options={options}
        selected={isPredict ? optionsIndex : null}
        onClick={clickOptionItemHandler}
      />
      <Chart kind="transfer" options={options} approx={approx} />
      <Modifier approx={approx} onChangeApprox={setApprox} />
    </div>
  );
});

export default Transfer;
