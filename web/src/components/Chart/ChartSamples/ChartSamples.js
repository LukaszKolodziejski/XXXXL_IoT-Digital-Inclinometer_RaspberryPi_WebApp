import React, { useState, useEffect, useCallback, useRef } from "react";

import { useSelector } from "react-redux";

const ChartSamples = React.memo((props) => {
  const socketValue = useSelector((state) => state.orientation.socketValue);
  const httpValue = useSelector((state) => state.shipping.httpValue);
  const mqttValue = useSelector((state) => state.shipping.mqttValue);
  const tcpValue = useSelector((state) => state.shipping.tcpValue);
  const udpValue = useSelector((state) => state.shipping.udpValue);

  const approxRef = useRef(null);

  // ---------- Orientation ------------
  const [samplesX, setSamplesX] = useState(new Array(20).fill(0));
  const [samplesY, setSamplesY] = useState(new Array(20).fill(0));
  const [samplesZ, setSamplesZ] = useState(new Array(20).fill(0));

  const XRef = useRef(null);
  const YRef = useRef(null);
  const ZRef = useRef(null);

  // ------- Shipping & Transfer---------
  const socketRef = useRef(null);
  const httpRef = useRef(null);
  const mqttRef = useRef(null);
  const tcpRef = useRef(null);
  const udpRef = useRef(null);

  useEffect(() => {
    approxRef.current = props.approx;
    if (socketValue && props.kind === "orientation") {
      XRef.current = socketValue.angle.X;
      YRef.current = socketValue.angle.Y;
      ZRef.current = socketValue.angle.Z;
    } else if (props.kind === "shipping") {
      if (socketValue) socketRef.current = socketValue.angle.X;
      if (httpValue) httpRef.current = httpValue.angle.X;
      if (mqttValue) mqttRef.current = mqttValue.angle.X;
      if (tcpValue) tcpRef.current = tcpValue.angle.X;
      if (udpValue) udpRef.current = udpValue.angle.X;
    } else if (props.kind === "transfer") {
      if (socketValue) socketRef.current = socketValue.transferTime;
      if (httpValue) httpRef.current = httpValue.transferTime;
      if (mqttValue) mqttRef.current = mqttValue.transferTime;
      if (tcpValue) tcpRef.current = tcpValue.transferTime;
      if (udpValue) udpRef.current = udpValue.transferTime;
    }
  });

  const [samplesSocketX, setSamplesSocketX] = useState(new Array(20).fill(0));
  const [samplesHttpX, setSamplesHttpX] = useState(new Array(20).fill(0));
  const [samplesMqttX, setSamplesMqttX] = useState(new Array(20).fill(0));
  const [samplesTcpX, setSamplesTcpX] = useState(new Array(20).fill(0));
  const [samplesUdpX, setSamplesUdpX] = useState(new Array(20).fill(0));

  const samplesHandler = useCallback(
    (V, setSamples) => {
      const v = Math.floor(V * 10) / 10;
      setSamples((prevSamples) => {
        const copyPrevSamples = [...prevSamples];

        const diff = copyPrevSamples.length - approxRef.current;
        if (diff > 0) for (let i = 0; i < diff; i++) copyPrevSamples.shift();
        else if (diff === 0) copyPrevSamples.shift();

        const newSamples = copyPrevSamples.concat(v);
        return newSamples;
      });
    },
    [approxRef]
  );

  /*eslint-disable */
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (props.kind === "orientation") {
        samplesHandler(XRef.current, setSamplesX);
        samplesHandler(YRef.current, setSamplesY);
        samplesHandler(ZRef.current, setSamplesZ);
      } else if (props.kind === "shipping" || props.kind === "transfer") {
        samplesHandler(socketRef.current, setSamplesSocketX);
        samplesHandler(httpRef.current, setSamplesHttpX);
        samplesHandler(mqttRef.current, setSamplesMqttX);
        samplesHandler(tcpRef.current, setSamplesTcpX);
        samplesHandler(udpRef.current, setSamplesUdpX);
      }
    }, 0);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const selectSamples = (s) => {
      const approx = approxRef.current;
      if (props.kind === "transfer") {
        const v = Math.floor(approx / 2);
        const arr =
          approx >= 3 ? (s[v - 1] + s[v] + s[v + 1]) / 3 : s[s.length - 1];
        return arr;
      } else {
        if (s.length >= 5) {
          const v = Math.floor((approx * 3) / 4);
          return (s[v - 1] + s[v] + s[v + 1]) / 3;
        } else return s[s.length - 1];
      }
    };

    const getDataSamples = (samples) => {
      const sample = [...samples];
      sample.sort((a, b) => a - b);
      let avg;
      if (props.kind === "transfer") {
        avg = Math.floor(selectSamples(sample));
      } else {
        avg = Math.floor(selectSamples(sample) * 10) / 10;
      }
      return avg;
    };

    if (props.kind === "orientation") {
      const x = getDataSamples(samplesX);
      const y = getDataSamples(samplesY);
      const z = getDataSamples(samplesZ);
      props.onGetDataSamples(x, y, z);
    } else if (props.kind === "shipping" || props.kind === "transfer") {
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
  /*eslint-enable */

  return <></>;
});

export default ChartSamples;
