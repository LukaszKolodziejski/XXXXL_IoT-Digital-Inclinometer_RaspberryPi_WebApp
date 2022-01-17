import React, { useState, useEffect, useCallback, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

const ChartSamples = (props) => {
  const socketValue = useSelector((state) => state.orientation.socketValue);
  const httpValue = useSelector((state) => state.shipping.httpValue);
  const mqttValue = useSelector((state) => state.shipping.mqttValue);
  const tcpValue = useSelector((state) => state.shipping.tcpValue);
  const udpValue = useSelector((state) => state.shipping.udpValue);
  // ---------- Orientation ------------
  const { X, Y, Z } = socketValue.angle;
  const [samplesX, setSamplesX] = useState(new Array(20).fill(0));
  const [samplesY, setSamplesY] = useState(new Array(20).fill(0));
  const [samplesZ, setSamplesZ] = useState(new Array(20).fill(0));

  const XRef = useRef();
  const YRef = useRef();
  const ZRef = useRef();

  // ---------- Shipping ----------------

  const socketAngleXRef = useRef();
  const httpAngleXRef = useRef();
  const mqttAngleXRef = useRef();
  const tcpAngleXRef = useRef();
  const udpAngleXRef = useRef();

  useEffect(() => {
    socketAngleXRef.current = socketValue.angle.X;
    httpAngleXRef.current = httpValue.angle.X;
    mqttAngleXRef.current = mqttValue.angle.X;
    tcpAngleXRef.current = tcpValue.angle.X;
    udpAngleXRef.current = udpValue.angle.X;
    XRef.current = X;
    YRef.current = Y;
    ZRef.current = Z;
  });

  const [samplesSocketX, setSamplesSocketX] = useState(new Array(20).fill(0));
  const [samplesHttpX, setSamplesHttpX] = useState(new Array(20).fill(0));
  const [samplesMqttX, setSamplesMqttX] = useState(new Array(20).fill(0));
  const [samplesTcpX, setSamplesTcpX] = useState(new Array(20).fill(0));
  const [samplesUdpX, setSamplesUdpX] = useState(new Array(20).fill(0));

  const samplesHandler = (V, setSamples) => {
    const v = Math.floor(V * 10) / 10;
    setSamples((prevSamples) => {
      const copyPrevSamples = [...prevSamples];
      copyPrevSamples.shift();
      const newSamples = copyPrevSamples.concat(v);
      return newSamples;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (props.kind === "orientation") {
        samplesHandler(XRef.current, setSamplesX);
        samplesHandler(YRef.current, setSamplesY);
        samplesHandler(ZRef.current, setSamplesZ);
      } else if (props.kind === "shipping") {
        samplesHandler(socketAngleXRef.current, setSamplesSocketX);
        samplesHandler(httpAngleXRef.current, setSamplesHttpX);
        samplesHandler(mqttAngleXRef.current, setSamplesMqttX);
        samplesHandler(tcpAngleXRef.current, setSamplesTcpX);
        samplesHandler(udpAngleXRef.current, setSamplesUdpX);
      }
    }, 0);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getDataSamples = (samples) => {
      const angle = [...samples];
      angle.sort((a, b) => a - b);
      const avg =
        Math.floor(((angle[15] + angle[16] + angle[17]) / 3) * 10) / 10;
      return avg;
    };

    if (props.kind === "orientation") {
      const x = getDataSamples(samplesX);
      const y = getDataSamples(samplesY);
      const z = getDataSamples(samplesZ);
      props.onGetDataSamples(x, y, z);
    } else if (props.kind === "shipping") {
      const socketX = getDataSamples(samplesSocketX);
      const httpX = getDataSamples(samplesHttpX);
      const mqttX = getDataSamples(samplesMqttX);
      const tcpX = getDataSamples(samplesTcpX);
      const udpX = getDataSamples(samplesUdpX);
      props.onGetDataSamples(socketX, httpX, mqttX, tcpX, udpX);
    }
  }, [
    samplesX,
    samplesY,
    samplesZ,
    samplesSocketX,
    samplesHttpX,
    samplesMqttX,
    samplesTcpX,
    samplesUdpX,
  ]);

  return <></>;
};

export default ChartSamples;
