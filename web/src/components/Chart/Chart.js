import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
  AreaChart,
  Area,
} from "recharts";
import ChartSamples from "./ChartSamples/ChartSamples";
import Button from "../UI/Button/Button";
import styles from "./Chart.module.css";
import { COLORS } from "../../constants/colors";
import { renderDot, getAxisTime } from "../../functions/functions";

const Chart = React.memo((props) => {
  const [chartData, setChartData] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isOptionActived, setIsOptionActived] = useState(false);
  const [chartLength, setChartLength] = useState(600);
  const [varChartLength, setVarChartLength] = useState(600);

  const [socketAngleY, setSocketAngleY] = useState(0);
  const [socketAngleZ, setSocketAngleZ] = useState(0);

  const [socketAngleX, setSocketAngleX] = useState(0);
  const [httpAngleX, setHttpAngleX] = useState(0);
  const [mqttAngleX, setMqttAngleX] = useState(0);
  const [tcpAngleX, setTcpAngleX] = useState(0);
  const [udpAngleX, setUdpAngleX] = useState(0);

  const { options } = props;

  const socketAngleXRef = useRef();
  const socketAngleYRef = useRef();
  const socketAngleZRef = useRef();

  const httpAngleXRef = useRef();
  const mqttAngleXRef = useRef();
  const tcpAngleXRef = useRef();
  const udpAngleXRef = useRef();

  const chartLengthRef = useRef();
  const chartVarLengthRef = useRef();

  useEffect(() => {
    if (props.kind === "orientation") {
      socketAngleXRef.current = socketAngleX;
      socketAngleYRef.current = socketAngleY;
      socketAngleZRef.current = socketAngleZ;
    } else if (props.kind === "shipping") {
      socketAngleXRef.current = socketAngleX;
      httpAngleXRef.current = httpAngleX;
      mqttAngleXRef.current = mqttAngleX;
      tcpAngleXRef.current = tcpAngleX;
      udpAngleXRef.current = udpAngleX;
    }
    chartLengthRef.current = chartLength;
    chartVarLengthRef.current = varChartLength;
  }, [
    socketAngleX,
    socketAngleY,
    socketAngleZ,
    socketAngleX,
    httpAngleX,
    mqttAngleX,
    tcpAngleX,
    udpAngleX,
    chartLength,
    varChartLength,
  ]);

  // Orientation
  const dataOrientationSamplesHandler = (x, y, z) => {
    setSocketAngleX(x);
    setSocketAngleY(y);
    setSocketAngleZ(z);
  };

  // Shipping
  const dataShippingSamplesHandler = (socketX, httpX, mqttX, tcpX, udpX) => {
    setSocketAngleX(socketX);
    setHttpAngleX(httpX);
    setMqttAngleX(mqttX);
    setTcpAngleX(tcpX);
    setUdpAngleX(udpX);
  };

  const chartDataHandler = useCallback(() => {
    if (!isPaused) {
      let newData;
      if (props.kind === "orientation") {
        const x = socketAngleXRef.current;
        const y = socketAngleYRef.current;
        const z = socketAngleZRef.current;
        newData = { time: getAxisTime(), x, y, z };
      } else if (props.kind === "shipping") {
        const websocket = socketAngleXRef.current;
        const http = httpAngleXRef.current;
        const mqtt = mqttAngleXRef.current;
        const tcp = tcpAngleXRef.current;
        const udp = udpAngleXRef.current;
        newData = { time: getAxisTime(), websocket, http, mqtt, tcp, udp };
      }
      const chartLen = chartLengthRef.current;
      const chartVarLen = chartVarLengthRef.current;

      setChartData((prevData) => {
        if (prevData.length > chartLen) {
          const copyData = [...prevData];
          const length = chartVarLen - chartLen;
          if (length > 0) {
            for (let i = 0; i <= length; i++) copyData.shift();
          }
          copyData.shift();
          copyData.shift();
          return [...copyData, newData];
        }
        return [...prevData, newData];
      });
      setVarChartLength(chartLen);
    }
  }, [
    socketAngleXRef,
    socketAngleYRef,
    socketAngleZRef,
    socketAngleXRef,
    httpAngleXRef,
    mqttAngleXRef,
    tcpAngleXRef,
    udpAngleXRef,
    isPaused,
  ]);

  const pauseHandler = () => setIsPaused((prev) => !prev);

  useEffect(() => {
    if (isOptionActived) {
      const interval = setInterval(chartDataHandler, 2);
      return () => clearInterval(interval);
    }
  }, [isPaused, isOptionActived]);

  useEffect(() => {
    const optionsActiveStatus = options.find((opt) => opt.active === true);
    setIsOptionActived(optionsActiveStatus ? true : false);

    const countActiveStatus = options.filter(
      (opt) => opt.active === true
    ).length;
    const length = (6.5 - countActiveStatus) * 100;
    setChartLength(length);
  }, [options]);

  const lineNameHandler = (optionText) => {
    if (props.kind === "orientation") {
      return `Axis ${optionText}`;
    } else if (props.kind === "shipping") {
      return `${optionText}: X`;
    }
  };

  const lines = options.map((opt) =>
    opt.active ? (
      <Line
        key={opt.text}
        dataKey={opt.text.toLowerCase()}
        name={lineNameHandler(opt.text)}
        stroke={COLORS[`${opt.text}`]}
        strokeWidth={2}
        yAxisId={0}
        dot={renderDot}
      />
    ) : null
  );

  const areas = options.map((opt) =>
    opt.active ? (
      <Area
        key={opt.text}
        dataKey={opt.text.toLowerCase()}
        stroke={COLORS[`${opt.text}`]}
        fill={COLORS[`${opt.text}`]}
      />
    ) : null
  );

  return (
    <div className={styles.Chart}>
      {chartData.length >= 80 ? (
        <div className={styles.ChartWrapper} style={{ margin: 40 }}>
          <LineChart width={750} height={500} data={chartData}>
            <YAxis type="number" yAxisId={0} domain={[0, 90]} />
            <XAxis dataKey="time" name="Time" />
            <Tooltip position={{ y: 200 }} />
            <CartesianGrid stroke="#f5f5f5" />
            {lines}
            <Brush dataKey="time" startIndex={chartData.length - 80}>
              <AreaChart>
                <CartesianGrid />
                {areas}
              </AreaChart>
            </Brush>
          </LineChart>
          <Button btnType={"Success"} clicked={() => setChartData([])}>
            {`Clear: ${chartData.length}`}
          </Button>
          {isOptionActived ? (
            <Button
              btnType={isPaused ? "Success" : "Danger"}
              clicked={pauseHandler}
            >
              {!isPaused ? "Pause" : "Go on !!!"}
            </Button>
          ) : null}
        </div>
      ) : null}
      {props.kind === "orientation" ? (
        <ChartSamples
          kind={props.kind}
          onGetDataSamples={dataOrientationSamplesHandler}
        />
      ) : props.kind === "shipping" ? (
        <ChartSamples
          kind={props.kind}
          onGetDataSamples={dataShippingSamplesHandler}
        />
      ) : null}
    </div>
  );
});

export default Chart;
