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
import { STROKE } from "../../constants/colors";
import { renderDot, getAxisTime } from "../../functions/functions";

const Chart = React.memo((props) => {
  const [chartData, setChartData] = useState([]);
  const [intervalClock, setIntervalClock] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOptionActived, setIsOptionActived] = useState(false);
  const [chartLength, setChartLength] = useState(600);
  const [varChartLength, setVarChartLength] = useState(600);
  const [angleX, setAngleX] = useState(0);
  const [angleY, setAngleY] = useState(0);
  const [angleZ, setAngleZ] = useState(0);
  const { options } = props;

  const angleXRef = useRef();
  const angleYRef = useRef();
  const angleZRef = useRef();
  const chartLengthRef = useRef();
  const chartVarLengthRef = useRef();

  useEffect(() => {
    angleXRef.current = angleX;
    angleYRef.current = angleY;
    angleZRef.current = angleZ;
    chartLengthRef.current = chartLength;
    chartVarLengthRef.current = varChartLength;
  });

  const dataSamplesHandler = (x, y, z) => {
    setAngleX(x);
    setAngleY(y);
    setAngleZ(z);
  };

  const chartDataHandler = useCallback(() => {
    if (!isPaused) {
      const x = angleXRef.current;
      const y = angleYRef.current;
      const z = angleZRef.current;
      const chartLen = chartLengthRef.current;
      const chartVarLen = chartVarLengthRef.current;

      const newData = { time: getAxisTime(), x, y, z };

      setChartData((prevData) => {
        if (prevData && prevData.length > chartLen) {
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
  }, [angleXRef, angleYRef, angleZRef, isPaused]);

  const pauseHandler = () => {
    setIsPaused((prev) => !prev);
    clearInterval(intervalClock);
  };

  useEffect(() => {
    if (isOptionActived) {
      const interval = setInterval(chartDataHandler, 5);
      setIntervalClock(interval);
    } else {
      clearInterval(intervalClock);
    }
  }, [isPaused, isOptionActived]);

  useEffect(() => {
    const optionsActiveStatus = options.find((opt) => opt.active === true);
    setIsOptionActived(optionsActiveStatus ? true : false);

    const countActiveStatus = options.filter(
      (opt) => opt.active === true
    ).length;
    const length = (6 - countActiveStatus) * 100;
    setChartLength(length);
  }, [options]);

  const lines = options.map((opt) =>
    opt.active ? (
      <Line
        key={opt.text}
        dataKey={opt.text.toLowerCase()}
        name={`Axis ${opt.text}`}
        stroke={STROKE[`${opt.text}`]}
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
        stroke={STROKE[`${opt.text}`]}
        fill={STROKE[`${opt.text}`]}
      />
    ) : null
  );

  return (
    <div className={styles.Chart}>
      {chartData && chartData.length >= 80 ? (
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
      <ChartSamples onGetDataSamples={dataSamplesHandler} />
    </div>
  );
});

export default Chart;
