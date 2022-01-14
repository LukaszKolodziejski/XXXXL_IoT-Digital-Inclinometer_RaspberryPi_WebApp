import React, { useState, useEffect } from "react";
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
import Button from "../UI/Button/Button";
import styles from "./Chart.module.css";

const data = [
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 28, y: 13, z: 24 },
  { time: 5, x: 20, y: 98, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: -18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 28, y: 13, z: 24 },
  { time: 5, x: 20, y: 98, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: -18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 28, y: 13, z: 24 },
  { time: 5, x: 20, y: 98, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: -18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 28, y: 13, z: 24 },
  { time: 5, x: 20, y: 98, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: -18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
  { time: 5, x: 28, y: 13, z: 24 },
  { time: 5, x: 20, y: 98, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: -18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 18, y: 48, z: 24 },
  { time: 5, x: 20, y: 24, z: 24 },
  { time: 5, x: 30, y: 45, z: 24 },
];

const initialState = {
  data,
  opacity: 1,
  anotherState: false,
};

const renderDot = (props) => {
  const { cx, cy, stroke, key } = props;
  if (cx === +cx && cy === +cy) {
    return <path d={`M${cx - 2},${cy - 2}h4v4h-4Z`} fill={stroke} key={key} />;
  } else return null;
};

const Chart = (props) => {
  const [data, setData] = useState(initialState.data);
  const [intervalFn, setIntervalFn] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isOptionActived, setIsOptionActived] = useState(false);

  const { options } = props;

  const math = () => Math.floor(Math.random() * 800) / 10;

  const intervalFnData = () => {
    const sec = new Date().getSeconds();
    const ms = new Date().getMilliseconds();
    const time = `${sec}.${Math.floor(ms / 100)}`;
    const newData = { time, x: math(), y: 48, z: 24 };
    if (!isPaused) setData((prevData) => [...prevData, newData]);
  };
  const pauseHandler = () => {
    setIsPaused((prev) => !prev);
    clearInterval(intervalFn);
  };

  useEffect(() => {
    if (isOptionActived) {
      const interval = setInterval(intervalFnData, 5);
      setIntervalFn(interval);
    } else {
      clearInterval(intervalFn);
    }
  }, [isPaused, isOptionActived]);

  useEffect(() => {
    const optionsActiveStatus = options.find((opt) => opt.active === true);
    setIsOptionActived(optionsActiveStatus ? true : false);
  }, [options]);

  const lines = options.map((opt) =>
    opt.active ? (
      <Line
        key={opt.text}
        dataKey={opt.text.toLowerCase()}
        name={`Axis ${opt.text}`}
        stroke="#ff7300" //TODO: change colors
        strokeWidth={2}
        yAxisId={0}
        dot={renderDot}
      />
    ) : null
  );

  return (
    <div className={styles.Chart}>
      <div className={styles.ChartWrapper} style={{ margin: 40 }}>
        <LineChart width={750} height={500} data={data}>
          <YAxis type="number" yAxisId={0} domain={[0, 90]} />
          <XAxis dataKey="time" name="Time" />
          <Tooltip position={{ y: 200 }} />
          <CartesianGrid stroke="#f5f5f5" />
          {lines}
          <Brush dataKey="time" startIndex={data.length - 40}>
            <AreaChart>
              <CartesianGrid />
              <Area dataKey="x" stroke="#ff7300" fill="#ff7300" />
              <Area dataKey="y" stroke="#f7f300" fill="#f7f300" />
              <Area dataKey="z" stroke="#ff73f0" fill="#ff73f0" />
            </AreaChart>
          </Brush>
        </LineChart>
      </div>
      {isOptionActived ? (
        <Button
          btnType={isPaused ? "Success" : "Danger"}
          clicked={pauseHandler}
        >
          {!isPaused ? "Pause" : "Go on !!!"}
        </Button>
      ) : null}
    </div>
  );
};

export default Chart;
